// let accessToken = '';
// const clientID = '7ca8f235ef0241fe8c802d28dbb91252';
// const redirectURI = 'http://localhost:3000'
// const redirectURI = 'https://playlist-124.vercel.app';

const Spotify = {
  // async getAccessToken() {
  //   if (accessToken) {
  //     return accessToken;
  //   }

  //   const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
  //   const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

  //   if (urlAccessToken && urlExpiresIn) {
  //     accessToken = urlAccessToken[1];
  //     const expiresIn = Number(urlExpiresIn[1]);
  //     window.setTimeout(() => {
  //       accessToken = '';
  //       window.history.pushState('Access Token', '', '/');
  //     }, expiresIn * 1000);
  //     return accessToken;
  //   } else {
  //     const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
  //     window.location = redirect;
  //     return new Promise((resolve) => {
  //       resolve();
  //     });
  //   }
  // },

  const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }
  
  const codeVerifier  = generateRandomString(64);

  const sha256 = async (plain) => {
      const encoder = new TextEncoder()
      const data = encoder.encode(plain)
      return window.crypto.subtle.digest('SHA-256', data)
  }

  const base64encode = (input) => {
      return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
  }

  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed);

  const clientId = '7ca8f235ef0241fe8c802d28dbb91252';
  const redirectUri = 'http://localhost:3000';

  const scope = 'user-read-private user-read-email';
  const authUrl = new URL("https://accounts.spotify.com/authorize")

  // generated in the previous step
  window.localStorage.setItem('code_verifier', codeVerifier);

  const params =  {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  }

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();

  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');

  const getToken = async code => {

      // stored in the previous step
      let codeVerifier = localStorage.getItem('code_verifier');
    
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      }
    
      const body = await fetch(url, payload);
      const response =await body.json();
    
      localStorage.setItem('access_token', response.access_token);
  }
  

  

  async search(term) {
    try {
      const access_token = await this.getAccessToken();
      const headers = { Authorization: `Bearer ${access_token}` };

      const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const jsonResponse = await response.json();

      if (!jsonResponse.tracks) {
        throw new Error('No tracks found.');
      }

      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
      }));
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  },

  async savePlaylistName(name, trackURIs) {
    try {
      if (!name || !trackURIs) {
        return;
      }

      const access_token = await this.getAccessToken();
      const headers = { Authorization: `Bearer ${access_token}` };

      // Get user ID
      const responseMe = await fetch('https://api.spotify.com/v1/me', {
        headers: headers,
      });
      const jsonResponseMe = await responseMe.json();
      const userID = jsonResponseMe.id;

      // Create a new playlist
      const responseCreatePlaylist = await fetch(
        `https://api.spotify.com/v1/users/${userID}/playlists`,
        {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ name: name }),
        }
      );
      const jsonResponseCreatePlaylist = await responseCreatePlaylist.json();
      const playlistID = jsonResponseCreatePlaylist.id;

      // Add tracks to the playlist
      await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ uris: trackURIs }),
      });

      // Playlist has been created and tracks added successfully
      console.log('Playlist created and tracks added successfully.');
    } catch (error) {
      console.error('Error:', error);
      // Handle errors or provide feedback to the caller
    }
  }
};

export { Spotify };