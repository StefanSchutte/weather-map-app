import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from './LoadingSpinner';
import { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import CloseIcon from '@mui/icons-material/Close';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

/**
 * A modal component that displays a 5-day weather forecast with a chart and details.
 * It also provides options for closing the modal and handling loading and error states.
 * @component
 * @param {Object} props - The component props
 * @param {Object} [props.forecastData=null] - The forecast data from the weather service (null if no data available)
 * @param {Function} props.onClose - A function to close the modal
 * @param {string|null} [props.error=null] - Error message if there was an error fetching the forecast data
 * @param {boolean} props.loading - A boolean indicating whether the data is still being fetched
 * @returns {JSX.Element|null} The rendered ForecastModal component or null if no forecast data and no loading or error states
 */
function ForecastModal({ forecastData, onClose, error, loading }) {
    const { darkMode } = useTheme();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!forecastData && !loading && !error) return null;

    /**
     * Constructs the data for the chart, including the temperature data for each forecast entry.
     * The chart will display the temperature (°C) for each period of the 5-day forecast.
     * @type {Object|null}
     */
    const chartData = forecastData
        ? {
            labels: forecastData.list.map((forecast) =>
                new Date(forecast.dt * 1000).toLocaleString('en-US', {
                    weekday: 'short',
                    hour: 'numeric',
                })
            ),
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: forecastData.list.map((forecast) => Math.round(forecast.main.temp)),
                    borderColor: darkMode ? '#90caf9' : '#6b7073',
                    backgroundColor: darkMode ? 'rgba(144, 202, 249, 0.2)' : 'rgba(107, 112, 115, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        }
        : null;

    /**
     * Configuration for the chart including options for axes, tooltips, and other UI elements.
     * The options are customized based on whether the dark mode is enabled.
     */
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: darkMode ? '#e0e0e0' : '#333333',
                },
            },
            tooltip: {
                backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                titleColor: darkMode ? '#e0e0e0' : '#333333',
                bodyColor: darkMode ? '#e0e0e0' : '#333333',
                borderColor: darkMode ? '#90caf9' : '#6b7073',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: darkMode ? '#e0e0e0' : '#333333',
                },
                grid: {
                    color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
            },
            y: {
                ticks: {
                    color: darkMode ? '#e0e0e0' : '#333333',
                },
                grid: {
                    color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
            },
        },
    };

    return (
        <div className={`forecast-modal-overlay ${darkMode ? 'dark' : ''}`} onClick={onClose}>
            <div className={`forecast-modal ${darkMode ? 'dark' : ''}`} onClick={(e) => e.stopPropagation()}>
                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <>
                        <p>{error}</p>
                        <button onClick={onClose} className="close-btn">Close</button>
                    </>
                ) : (
                    <>
                        <h2>5-Day Forecast</h2>
                        <div className="forecast-chart">
                            {chartData && (
                                <Line data={chartData} options={chartOptions} height={250} />
                            )}
                        </div>
                        <div className="forecast-details">
                            {Object.entries(
                                forecastData.list.reduce((acc, forecast) => {
                                    const date = new Date(forecast.dt * 1000).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'short',
                                        day: 'numeric',
                                    });

                                    if (!acc[date]) {
                                        acc[date] = {
                                            minTemp: forecast.main.temp,
                                            maxTemp: forecast.main.temp,
                                            details: forecast,
                                        };
                                    } else {
                                        acc[date].minTemp = Math.min(acc[date].minTemp, forecast.main.temp);
                                        acc[date].maxTemp = Math.max(acc[date].maxTemp, forecast.main.temp);
                                    }
                                    return acc;
                                }, {})
                            ).slice(0, 5).map(([date, { minTemp, maxTemp, details }], index) => (
                                <div key={index} className="forecast-card">
                                    <div className="forecast-date">{date}</div>
                                    <div className="forecast-icon">
                                        <img
                                            src={`https://openweathermap.org/img/wn/${details.weather[0].icon}.png`}
                                            alt={details.weather[0].description}
                                        />
                                    </div>
                                    <div className="forecast-temp">
                                        {Math.round(maxTemp)}°C / {Math.round(minTemp)}°C
                                    </div>
                                    <div className="forecast-weather">
                                        {details.weather[0].description}
                                    </div>
                                    <div className="forecast-extra">
                                        <p>Humidity: {details.main.humidity}%</p>
                                        <p>Wind: {details.wind.speed} m/s</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={onClose} className="close-btn">
                            <CloseIcon />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForecastModal;
