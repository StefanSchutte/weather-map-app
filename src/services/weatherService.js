import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

/**
 * Fetches weather data from the OpenWeatherMap API.
 * @param {number} lat - Latitude of the location
 * @param {number} lng - Longitude of the location
 * @param {Function} setWeatherData - Function to set weather data
 * @param {Function} setError - Function to set error messages
 * @param {Function} setLoading - Function to toggle loading state
 * @returns {Promise} - Promise that resolves with the weather data
 */
export async function fetchWeatherData(lat, lng, setWeatherData, setError, setLoading) {
    setLoading(true);
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
        );
        setWeatherData(response.data);
        setError(null);
        return response.data;
    } catch (err) {
        console.error('API Error:', err);
        const errorMsg = err.response?.data?.message || 'Failed to fetch weather data';
        setError(errorMsg);
        setWeatherData(null);
        throw new Error(errorMsg);
    } finally {
        setLoading(false);
    }
}