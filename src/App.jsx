import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Map from './components/Map';
import WeatherInfo from './components/WeatherInfo';
import SearchBar from './components/SearchBar';
import ThemeToggle from './components/ThemeToggle';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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
                        Leaflet Weather Map
                    </h1>
                    <div className="header-right">
                        <SearchBar
                            setPosition={setPosition}
                            setWeatherData={setWeatherData}
                            setError={setError}
                            setLoading={setLoading}
                        />
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
                <div className="theme-toggle-container">
                    <ThemeToggle />
                </div>
                {/* Toast Container */}
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </div>
        </ThemeProvider>
    );
}

export default App;