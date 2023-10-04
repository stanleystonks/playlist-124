import styles from './Header.module.css'

import SearchBar from "../SearchBar/SearchBar"

function Header({ onSearch }) {
    return (
        <header className={styles.header}>
            <section className={styles.hero}>
                <h1 className={styles.heading}>Playlist 124</h1>
                <span className={styles.subheading}>Some additional Spotify playlist features.</span>
            </section>
            <section className={styles.searchBar}>
                <SearchBar
                    onSearch={onSearch}
                />
            </section>
        </header>
    )
}

export default Header;