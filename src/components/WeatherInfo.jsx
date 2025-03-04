import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from './LoadingSpinner';
import ForecastModal from './ForecastModal';
import { fetchForecastData } from '../services/weatherService';
import { useState } from 'react';
import {toast} from "react-toastify";

/**
 * Displays weather information based on data fetched from OpenWeatherMap API.
 * Handles loading, error, and data states and allows users to view a 5-day weather forecast.
 * @component
 * @param {Object} props - The component props
 * @param {Object|null} props.weatherData - Weather data from OpenWeatherMap API (null if no data available)
 * @param {string|null} props.error - Error message if API request failed (null if no error)
 * @param {boolean} props.loading - Boolean indicating whether weather data is being fetched
 * @returns {JSX.Element} The rendered WeatherInfo component, which displays the current weather and a button to view the 5-day forecast
 */
function WeatherInfo({ weatherData, error, loading }) {
    const { darkMode } = useTheme();
    const [forecastData, setForecastData] = useState(null);
    const [forecastLoading, setForecastLoading] = useState(false);
    const [forecastError, setForecastError] = useState(null);
    const [showForecastModal, setShowForecastModal] = useState(false);

    /**
     * Fetches the 5-day weather forecast based on the latitude and longitude of the current weather data.
     * Updates the component's state with forecast data, loading state, or error.
     */
    const handleFetchForecast = async () => {
        if (!weatherData?.coord) return;

        const { lat, lon } = weatherData.coord;
        try {
            await fetchForecastData(lat, lon, setForecastData, setForecastError, setForecastLoading);
            setShowForecastModal(true);
        } catch (err) {
            toast.error(`Error fetching forecast: ${err.message}`);
            console.error('Error fetching forecast:', err);
        }
    };

    if (loading) {
        return (
            <div className={`weather-info ${darkMode ? 'dark' : ''}`}>
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className={`weather-info error ${darkMode ? 'dark' : ''}`}>
                <p>{error}</p>
            </div>
        );
    }

    if (!weatherData) {
        return (
            <div className={`weather-info ${darkMode ? 'dark' : ''}`}>
                <p>Click on the map to see weather details</p>
            </div>
        );
    }

    const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

    return (
        <div className={`weather-info ${darkMode ? 'dark' : ''}`}>
            <h2>{weatherData.name || 'Unknown Location'}</h2>
            <div className="weather-icon-container">
                <img
                    src={iconUrl}
                    alt={weatherData.weather[0].description}
                    className="weather-icon"
                />
                <div className="temperature">
                    <span className="temp-value">{Math.round(weatherData.main.temp)}</span>
                    <span className="temp-unit">°C</span>
                </div>
            </div>
            <div className="weather-description">
                {weatherData.weather[0].description}
            </div>
            <div className="weather-details">
                <div className="detail-item">
                    <span className="detail-label">Feels Like</span>
                    <span className="detail-value">{Math.round(weatherData.main.feels_like)}°C</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{weatherData.main.humidity}%</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Wind Speed</span>
                    <span className="detail-value">{weatherData.wind.speed} m/s</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Pressure</span>
                    <span className="detail-value">{weatherData.main.pressure} hPa</span>
                </div>
                {weatherData.visibility && (
                    <div className="detail-item">
                        <span className="detail-label">Visibility</span>
                        <span className="detail-value">{(weatherData.visibility / 1000).toFixed(1)} km</span>
                    </div>
                )}
            </div>
            <div className="coordinates">
                <small>Lat: {weatherData.coord.lat.toFixed(4)}, Lon: {weatherData.coord.lon.toFixed(4)}</small>
            </div>

            <button
                onClick={handleFetchForecast}
                className={`forecast-button ${darkMode ? 'dark' : ''}`}
            >
                View 5-Day Forecast
            </button>

            {showForecastModal && (
                <ForecastModal
                    forecastData={forecastData}
                    onClose={() => setShowForecastModal(false)}
                    error={forecastError}
                    loading={forecastLoading}
                />
            )}
        </div>
    );
}

export default WeatherInfo;