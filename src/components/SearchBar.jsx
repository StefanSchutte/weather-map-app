import { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext';
import { fetchWeatherData } from '../services/weatherService.js';
import { toast } from 'react-toastify';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

/**
 * SearchBar component for searching city weather data with support for multiple cities with the same name.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Function} props.setPosition - Function to update the map position ([lat, lon]).
 * @param {Function} props.setWeatherData - Function to update the weather data state.
 * @param {Function} props.setError - Function to set error messages.
 * @param {Function} props.setLoading - Function to set the loading state.
 *
 * @returns {JSX.Element} A form with an input field, search button, and city selection dropdown when applicable.
 */
function SearchBar({ setPosition, setWeatherData, setError, setLoading }) {
    const [search, setSearch] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [cityOptions, setCityOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
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
        setCityOptions([]);
        setShowOptions(false);

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${API_KEY}`
            );

            if (response.data.length === 0) {
                setError(`City "${search}" not found`);
                return;
            }

            if (response.data.length === 1) {
                const { lat, lon } = response.data[0];
                setPosition([lat, lon]);
                await fetchWeatherData(lat, lon, setWeatherData, setError, setLoading);
            } else {
                const options = response.data.map(city => ({
                    name: city.name,
                    state: city.state,
                    country: city.country,
                    lat: city.lat,
                    lon: city.lon
                }));

                setCityOptions(options);
                setShowOptions(true);
                setError(null);
            }
        } catch (err) {
            setError('Failed to search for location');
            toast.error(`Search error: ${err.message}`);
        } finally {
            setSearchLoading(false);
        }
    };

    /**
     * Handles city selection from the dropdown.
     *
     * @param {Object} city - The selected city object.
     */
    const handleCitySelect = async (city) => {
        try {
            setLoading(true);
            setShowOptions(false);
            setPosition([city.lat, city.lon]);
            await fetchWeatherData(city.lat, city.lon, setWeatherData, setError, setLoading);
        } catch (err) {
            setError(`Error fetching weather for ${city.name}: ${err.message}`);
            toast.error(`Weather data error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container">
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

            {showOptions && cityOptions.length > 0 && (
                <div className={`city-options ${darkMode ? 'dark' : ''}`}>
                    <p className="options-title">Multiple locations found:</p>
                    <ul>
                        {cityOptions.map((city, index) => (
                            <li key={index} onClick={() => handleCitySelect(city)}>
                                {city.name}
                                {city.state && `, ${city.state}`}
                                {city.country && ` (${city.country})`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchBar;