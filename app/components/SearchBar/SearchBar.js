"use client"

import React, { useState } from 'react';
import styles from './SearchBar.module.css';

function SearchBar({ onSearch }) {
    //State of search term
    const [searchTerm, setSearchTerm] = useState('');

    // Handle user input in search box
    function handleChange(e) {
        setSearchTerm(e.target.value);
    }

    // Search button/form functionality
    function handleSubmit(e) {
        e.preventDefault();
        onSearch(searchTerm);
        setSearchTerm('');
    }

    // Return JSX
    return (
        <form className={styles.searchBar} onSubmit={handleSubmit}>
            <label htmlFor="searchInput" className={`${styles.searchLabel} ${styles.visuallyHidden}`}>
                Search:
            </label>
            <input
                id="searchInput"
                value={searchTerm}
                type="text"
                placeholder="Enter Song, Artist, or Album"
                onChange={handleChange}
                className={styles.searchInput}
            />
            <button
                type="submit"
                aria-label="Search"
                className={styles.searchButton}
            >
                Search
            </button>
        </form>
    );
}

export default SearchBar;