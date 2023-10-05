let accessToken = '';
const clientID = process.env.CLIENT_ID;
const redirectURI = 'https://playlist-124.vercel.app';

const Spotify = {
  async getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if (urlAccessToken && urlExpiresIn) {
      accessToken = urlAccessToken[1];
      const expiresIn = Number(urlExpiresIn[1]);
      window.setTimeout(() => {
        accessToken = '';
        window.history.pushState('Access Token', '', '/');
      }, expiresIn * 1000);
      return accessToken;
    } else {
      const redirect = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = redirect;
      return new Promise((resolve) => {
        resolve();
      });
    }
  },

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