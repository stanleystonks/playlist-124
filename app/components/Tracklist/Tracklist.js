import Track from '../Track/Track';
import styles from './Tracklist.module.css'

function Tracklist({ trackCounter, results, onAdd, onRemove, isRemoval }) {
    return (
        <ul className={styles.tracklist}>
            {results.map(result => (
                <li key={result.id}>
                    <Track
                        track={result}
                        onAdd={onAdd}
                        onRemove={onRemove}
                        isRemoval={isRemoval}
                        trackCounter={trackCounter}
                    />
                </li>
            ))}
        </ul>
    );
}

export default Tracklist;