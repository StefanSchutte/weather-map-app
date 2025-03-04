import { MapContainer, TileLayer, useMapEvents, useMap, Marker, Popup } from 'react-leaflet';
import { useTheme } from '../contexts/ThemeContext';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { fetchWeatherData } from '../services/weatherService';
import { toast } from 'react-toastify';

const DEFAULT_POSITION = [-25.7458, 28.1859]; // Pretoria
/** Custom marker icon with adjusted size and anchor points */
const customMarkerIcon = icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [30, 41],
    iconAnchor: [17, 41],
    popupAnchor: [0, -41]
});

/**
 * Handles map click events to update position and fetch weather data.
 * @param {Object} props - Component props
 * @param {Function} props.setPosition - Function to update the selected position
 * @param {Function} props.setWeatherData - Function to set fetched weather data
 * @param {Function} props.setError - Function to set error messages
 * @param {Function} props.setLoading - Function to toggle loading state
 */
function MapEvents({ setPosition, setWeatherData, setError, setLoading }) {
    useMapEvents({
        click: async (e) => {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            try {
                await fetchWeatherData(lat, lng, setWeatherData, setError, setLoading);
            } catch (err) {
                toast.error(`Error fetching weather data: ${err.message}`);
            }
        },
    });
    return null;
}

/**
 * Changes the map view when the center position changes.
 *
 * @param {Object} props - Component props
 * @param {Array<number>} props.center - Latitude and longitude to center the map
 */
function ChangeView({ center }) {
    const map = useMap();
    const currentZoom = map.getZoom();
    map.setView(center, currentZoom);
    return null;
}

/**
 * Renders the interactive map with location markers and weather data.
 * @param {Object} props - Component props
 * @param {Array<number>} props.position - Current position [latitude, longitude]
 * @param {Function} props.setPosition - Function to update the position
 * @param {Function} props.setWeatherData - Function to set weather data
 * @param {Function} props.setError - Function to set error messages
 * @param {Function} props.setLoading - Function to toggle loading state
 * @param {Object} props.weatherData - Weather data from the API
 */
function Map({ position, setPosition, setWeatherData, setError, setLoading, weatherData }) {
    const { darkMode } = useTheme();
    const [geolocating, setGeolocating] = useState(true);

    useEffect(() => {
        const initializeMap = async () => {
            if (navigator.geolocation) {
                setGeolocating(true);
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        setPosition([latitude, longitude]);
                        try {
                            await fetchWeatherData(latitude, longitude, setWeatherData, setError, setLoading);
                        } catch (err) {
                            toast.error(`Error fetching weather data for your location: ${err.message}`);
                        }
                        setGeolocating(false);
                    },
                    async (error) => {
                        console.error('Geolocation error:', error);
                        setPosition(DEFAULT_POSITION);
                        try {
                            await fetchWeatherData(DEFAULT_POSITION[0], DEFAULT_POSITION[1], setWeatherData, setError, setLoading);
                        } catch (err) {
                            toast.error(`Error fetching weather data for default location: ${err.message}`);
                        }
                        setGeolocating(false);
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
            } else {
                setError('Geolocation is not supported by your browser');
                setPosition(DEFAULT_POSITION);
                try {
                    await fetchWeatherData(DEFAULT_POSITION[0], DEFAULT_POSITION[1], setWeatherData, setError, setLoading);
                } catch (err) {
                    toast.error(`Error fetching weather data for default location: ${err.message}`);
                }
                setGeolocating(false);
            }
        };

        initializeMap();
    }, [setPosition, setWeatherData, setError, setLoading]);

    const tileUrl = darkMode
        ? 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = darkMode
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const cityName = weatherData?.name || 'Unknown Location';

    return (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}>
            {geolocating && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    background: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
                    color: darkMode ? 'white' : 'black',
                    padding: '10px',
                    borderRadius: '5px'
                }}>
                    Getting your location...
                </div>
            )}
            <MapContainer
                center={position || DEFAULT_POSITION}
                zoom={13}
                minZoom={2}
                style={{ height: '100%', width: '100%' }}
                maxBounds={[[-90, -180], [90, 180]]}
                maxBoundsViscosity={1.0}
            >
                <TileLayer
                    url={tileUrl}
                    attribution={attribution}
                    noWrap={true}
                />
                <ChangeView center={position || DEFAULT_POSITION} />
                {position && (
                    <Marker position={position} icon={customMarkerIcon}>
                        <Popup>
                            <strong>{cityName}</strong><br />
                            Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}
                        </Popup>
                    </Marker>
                )}
                <MapEvents
                    setPosition={setPosition}
                    setWeatherData={setWeatherData}
                    setError={setError}
                    setLoading={setLoading}
                />
            </MapContainer>
        </div>
    );
}

export default Map;