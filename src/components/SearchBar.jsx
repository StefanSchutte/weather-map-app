import { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { fetchWeatherData } from '../services/weatherService.js';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

/**
 * SearchBar component for searching city weather data and updating the map position.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Function} props.setPosition - Function to update the map position ([lat, lon]).
 * @param {Function} props.setWeatherData - Function to update the weather data state.
 * @param {Function} props.setError - Function to set error messages.
 * @param {Function} props.setLoading - Function to set the loading state.
 *
 * @returns {JSX.Element} A form with an input field and a search button.
 */
function SearchBar({ setPosition, setWeatherData, setError, setLoading }) {
    const [search, setSearch] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const { darkMode } = useTheme();

    /**
     * Handles city search submission.
     *
     * @param {React.FormEvent} e - The form submit event.
     */
    const handleSearch = async (e) => {
        e.preventDefault();

        if (!search.trim()) return;

        setSearchLoading(true);

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=${API_KEY}`
            );

            if (response.data.length === 0) {
                setError(`City "${search}" not found`);
                return;
            }

            const { lat, lon } = response.data[0];
            setPosition([lat, lon]);

            await fetchWeatherData(lat, lon, setWeatherData, setError, setLoading);

        } catch {
            setError('Failed to search for location');
        } finally {
            setSearchLoading(false);
        }
    };

    return (
        <form className={`search-bar ${darkMode ? 'dark' : ''}`} onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Search for a city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={darkMode ? 'dark' : ''}
            />
            <button type="submit" disabled={searchLoading} className={darkMode ? 'dark' : ''}>
                {searchLoading ? '...' : 'Search'}
            </button>
        </form>
    );
}

export default SearchBar;