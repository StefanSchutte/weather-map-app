import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * Displays weather information based on data fetched from OpenWeatherMap API.
 * Renders different UI states based on loading, error, and data availability.
 * @component
 * @param {Object} props - Component props
 * @param {Object|null} props.weatherData - Weather data from OpenWeatherMap API
 * @param {string|null} props.error - Error message if API request failed
 * @param {boolean} props.loading - Loading state indicator
 * @returns {JSX.Element} The rendered WeatherInfo component
 */
function WeatherInfo({ weatherData, error, loading }) {
    const { darkMode } = useTheme();

    if (loading) {
        return (
            <div className={`weather-info ${darkMode ? 'dark' : ''}`}>
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return <div className={`weather-info error ${darkMode ? 'dark' : ''}`}>
            <p>{error}</p>
        </div>;
    }

    if (!weatherData) {
        return <div className={`weather-info ${darkMode ? 'dark' : ''}`}>
            <p>Click on the map to see weather details</p>
        </div>;
    }

    const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

    return (
        <div className={`weather-info ${darkMode ? 'dark' : ''}`}>
            <h2 >{weatherData.name || 'Unknown Location'}</h2>
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
        </div>
    );
}

export default WeatherInfo;