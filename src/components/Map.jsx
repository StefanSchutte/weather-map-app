import { MapContainer, TileLayer, useMapEvents, useMap, Marker, Popup } from 'react-leaflet';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const DEFAULT_POSITION = [-25.7458, 28.1859]; // Pretoria, South Africa
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
            fetchWeatherData(lat, lng, setWeatherData, setError, setLoading);
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
    map.setView(center, 13);
    return null;
}

/**
 * Fetches weather data from the OpenWeatherMap API.
 *
 * @param {number} lat - Latitude of the location
 * @param {number} lng - Longitude of the location
 * @param {Function} setWeatherData - Function to set weather data
 * @param {Function} setError - Function to set error messages
 * @param {Function} setLoading - Function to toggle loading state
 */
export async function fetchWeatherData(lat, lng, setWeatherData, setError, setLoading) {
    setLoading(true);
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
        );
        setWeatherData(response.data);
        setError(null);
    } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.message || 'Failed to fetch weather data');
        setWeatherData(null);
    } finally {
        setLoading(false);
    }
}

/**
 * Renders the interactive map with location markers and weather data.
 * @param {Object} props - Component props
 * @param {Array<number>} props.position - Current position [latitude, longitude]
 * @param {Function} props.setPosition - Function to update the position
 * @param {Function} props.setWeatherData - Function to set weather data
 * @param {Function} props.setError - Function to set error messages
 * @param {Function} props.setLoading - Function to toggle loading state
 */
function Map({ position, setPosition, setWeatherData, setError, setLoading }) {
    const { darkMode } = useTheme();
    const [geolocating, setGeolocating] = useState(true);

    useEffect(() => {
        if (navigator.geolocation) {
            setGeolocating(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]);
                    fetchWeatherData(latitude, longitude, setWeatherData, setError, setLoading);
                    setGeolocating(false);
                },
                (error) => {
                    console.error('Geolocation error:', error);

                    setPosition(DEFAULT_POSITION);
                    fetchWeatherData(DEFAULT_POSITION[0], DEFAULT_POSITION[1], setWeatherData, setError, setLoading);
                    setGeolocating(false);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            setError('Geolocation is not supported by your browser');
            setPosition(DEFAULT_POSITION);
            fetchWeatherData(DEFAULT_POSITION[0], DEFAULT_POSITION[1], setWeatherData, setError, setLoading);
            setGeolocating(false);
        }
    }, [setPosition, setWeatherData, setError, setLoading]);

    const tileUrl = darkMode
        ? 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = darkMode
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

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
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url={tileUrl}
                    attribution={attribution}
                />
                <ChangeView center={position || DEFAULT_POSITION} />
                {position && (
                    <Marker position={position} icon={customMarkerIcon}>
                        <Popup>
                            Selected Location <br />
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