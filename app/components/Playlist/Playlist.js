import styles from './Playlist.module.css';

import Tracklist from '../Tracklist/Tracklist';

function Playlist({ trackCount, trackCounter, playlistName, playlistTracks, onRemove, onNameChange, onSave }) {
    // Handle user-defined playlist name
    function handleNameChange(e) {
        onNameChange(e.target.value);
    }

    // Return JSX
    return (
        <section className={styles.playlist}>
            <input
                value={playlistName}
                placeholder='Playlist name'
                onChange={handleNameChange}
                className={styles.playlistName}
            />
            <Tracklist
                results={playlistTracks}
                onRemove={onRemove}
                isRemoval={true}
                trackCounter={trackCounter}
            />
            {!!trackCount && (
                <button
                    className={styles.playlistSave}
                    type='button'
                    onClick={onSave}
                >
                    Save to Spotify
                </button>
            )}
        </section>
    );
}

export default Playlist;