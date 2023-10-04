export const ACTIONS = {
    SET_RESULTS: 'set-results',
    SET_PLAYLIST_NAME: 'set-playlist-name',
    SET_PLAYLIST_TRACKS: 'set-playlist-tracks',
    SET_HAS_SEARCHED: 'set-has-searched'
}

export const reducer = (state, action) => {

    const { type, payload } = action;

    switch (type) {
        case ACTIONS.SET_RESULTS:
            return { ...state, results: payload };
        case ACTIONS.SET_PLAYLIST_NAME:
            return { ...state, playlistName: payload };
        case ACTIONS.SET_PLAYLIST_TRACKS:
            return { ...state, playlistTracks: typeof payload === 'function' ? payload(state.playlistTracks) : payload };
        case ACTIONS.SET_HAS_SEARCHED:
            return { ...state, hasSearched: true };
        default:
            throw new Error('Invalid arguments to reducer().');
    }
}

export const STATE = {
    results: [],
    playlistName: 'New Playlist #',
    playlistTracks: [],
    hasSearched: false
}