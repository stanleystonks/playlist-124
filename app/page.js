"use client"

import { useEffect, useReducer, useRef } from 'react';

import { reducer, ACTIONS, STATE } from './reducer';
import { Spotify } from './util/Spotify';

import Header from './components/Header/Header';
import Playlist from './components/Playlist/Playlist';
import SearchResults from './components/SearchResults/SearchResults';

import styles from './page.module.css'

export default function Home() {
  const [state, dispatch] = useReducer(reducer, STATE);
  const hasSearchedRef = useRef(false);
  const trackCount = useRef(0);

  useEffect(() => {
    Spotify.getAccessToken();
  }, []);

  // SearchBar functionality
  function searchDatabase(term) {
    if (term === '') {
      alert('Please, enter a valid search term');
      return;
    }

    Spotify.search(term).then(result => {
      dispatch({ type: ACTIONS.SET_RESULTS, payload: result });
    });

    if (!hasSearchedRef.current) {
      dispatch({ type: ACTIONS.SET_HAS_SEARCHED });
      hasSearchedRef.current = true;
    }
  }

  // SearchResults functionality
  function addTrack(track) {
    if (state.playlistTracks.some(playlistTrack => playlistTrack.id === track.id)) {
      alert('Track already exists in playlist.');
      return;
    } else {
      dispatch({
        type: ACTIONS.SET_PLAYLIST_TRACKS,
        payload: (prevTracks) => [...prevTracks, track]
      })
    }
  }

  function removeTrack(track) {
    const reducedTracks = state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id);
    dispatch({
      type: ACTIONS.SET_PLAYLIST_TRACKS,
      payload: reducedTracks
    })
  }

  // Playlist functionality
  function updatePlaylistName(name) {
    dispatch({ type: ACTIONS.SET_PLAYLIST_NAME, payload: name });
  }

  function savePlaylist() {
    if (!trackCount.current) {
      alert('Playlist is empty, please add tracks.');
      return;
    } else {
      const trackURIs = state.playlistTracks.map(track => track.uri);
      Spotify.savePlaylistName(state.playlistName, trackURIs).then(() => {
        dispatch({ type: ACTIONS.SET_PLAYLIST_NAME, payload: 'New Playlist #' });
        dispatch({ type: ACTIONS.SET_PLAYLIST_TRACKS, payload: [] });
      });
    }
  }

  // Determine if playlist is empty
  function trackCounter(arg) {
    if (arg) {
      trackCount.current++;
    } else {
      trackCount.current--;
    }
  }

  // Return JSX
  return (
    <>
      <Header
        onSearch={searchDatabase}
      />
      {state.hasSearched && (
        <main className={styles.main}>
          <SearchResults
            results={state.results}
            onAdd={addTrack}
            trackCounter={trackCounter}
          />
          <Playlist
            playlistName={state.playlistName}
            playlistTracks={state.playlistTracks}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist}
            trackCount={trackCount.current}
            trackCounter={trackCounter}
          />
        </main>
      )}
    </>
  )
}
