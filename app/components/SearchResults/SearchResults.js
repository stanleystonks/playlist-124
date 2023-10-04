import styles from './SearchResults.module.css';

import Tracklist from '../Tracklist/Tracklist';

function SearchResults({ trackCounter, onAdd, results }) {
    return (
        <section className={styles.searchResults}>
            <h2 className={styles.yourResults}>Your Results</h2>
            <Tracklist
                results={results}
                onAdd={onAdd}
                isRemoval={false}
                trackCounter={trackCounter}
            />
        </section>
    );
}

export default SearchResults;