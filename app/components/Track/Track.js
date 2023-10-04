import styles from './Track.module.css';

function Track({ trackCounter, track, isRemoval, onAdd, onRemove }) {
    // Determine sign of button, addition or subtraction
    function buttonSign() {
        if (isRemoval) {
            return <button className={styles.trackAction} onClick={removeTrack}>-</button>;
        } else {
            return <button className={styles.trackAction} onClick={addTrack}>+</button>;
        }
    }

    // Add track to playlist
    function addTrack() {
        onAdd(track);
        trackCounter(true);
    }

    // Remove track from playlist
    function removeTrack() {
        onRemove(track);
        trackCounter(false);
    }

    // Return JSX
    return (
        <div className={styles.track}>
            <div className={styles.trackInformation}>
                <h3>{track.name}</h3>
                <p className={styles.trackDetails}>{track.artist} | {track.album}</p>
            </div>
            {buttonSign()}
        </div>
    );
}

export default Track;