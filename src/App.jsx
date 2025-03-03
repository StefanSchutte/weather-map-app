import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Map from './components/Map';
import WeatherInfo from './components/WeatherInfo';
import SearchBar from './components/SearchBar';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [position, setPosition] = useState([51.505, -0.09]); // Default: London
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Reset error when position changes
    useEffect(() => {
        setError(null);
    }, [position]);

    return (
        <ThemeProvider>
            <div className="app">
                <div className="header">
                    <h1>
                        <img
                            src="/season.png"
                            alt="Seasons"
                            className="logo"
                        />
                        Weather Map Leaflet
                    </h1>
                    <div className="header-controls">
                        <SearchBar
                            setPosition={setPosition}
                            setWeatherData={setWeatherData}
                            setError={setError}
                            setLoading={setLoading}
                        />
                        <ThemeToggle />
                    </div>
                </div>
                <div className="content">
                    <div className="map-container">
                        <Map
                            position={position}
                            setPosition={setPosition}
                            setWeatherData={setWeatherData}
                            setError={setError}
                            setLoading={setLoading}
                        />
                    </div>
                    <div className="sidebar">
                        <WeatherInfo
                            weatherData={weatherData}
                            error={error}
                            loading={loading}
                        />
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;