# Weather Map Application

## Overview
A responsive React application that displays real-time weather information for any location on an interactive map. Users can click on the map or search for cities to get detailed weather data from the OpenWeatherMap API.

## Features
- Interactive map using React Leaflet with both light and dark themes
- Real-time weather data display with temperature, conditions, humidity, wind speed, etc.
- Geolocation support to detect user's current location
- City search functionality
- Responsive design for desktop, tablet, and mobile devices
- Light/dark mode toggle with persistent user preference

## Technologies Used
- React
- Vite (for fast development environment)
- React Leaflet (map component)
- OpenWeatherMap API (weather data)
- Axios (for API requests)
- Context API (for theme management)
- CSS (with responsive design)

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenWeatherMap API key (free tier available)

## Installation and Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/weather-map-app.git
   cd weather-map-app
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Create an environment file
    - Create a `.env` file in the root directory with the following content:
   ```
   VITE_OPENWEATHERMAP_API_KEY=your_api_key_here
   ```
    - Replace `your_api_key_here` with your actual OpenWeatherMap API key
    - You can get a free API key by signing up at [OpenWeatherMap](https://openweathermap.org/api)

4. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## Project Structure
```
/weather-map-app
├── public/               # Static assets
│   └── season.png        # Logo image
├── src/
│   ├── components/       # React components
│   │   ├── Map.jsx       # Map component with Leaflet integration
│   │   ├── SearchBar.jsx # City search functionality
│   │   ├── ThemeToggle.jsx # Light/dark mode switcher
│   │   └── WeatherInfo.jsx # Weather data display
│   ├── contexts/
│   │   └── ThemeContext.jsx # Theme state management
│   ├── services/
│   │   └── weatherServices.js # Api service 
│   ├── App.jsx           # Main application component
│   ├── App.css           # Global styles
│   └── main.jsx          # Entry point
├── .env                  # Environment variables (not tracked in git)
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## Usage
- **Map Navigation**: Drag to move the map, use the +/- buttons to zoom
- **Get Weather Data**: Click anywhere on the map to see the weather for that location
- **Search**: Enter a city name in the search bar to find its weather
- **Theme Toggle**: Click the sun/moon icon in the bottom right to switch between light and dark mode

## Assumptions
- Users will provide their own OpenWeatherMap API key
- The OpenWeatherMap free tier (1,000 API calls/day) is sufficient for personal use
- Users may grant or deny location access in their browser
- A stable internet connection is required for fetching map tiles and weather data

## Future Improvements
- Weather forecast for upcoming days
- Historical weather data visualization
- Multiple weather data providers
- Customizable units (metric/imperial)
- Saving favorite locations

## Acknowledgements
- [OpenWeatherMap](https://openweathermap.org/) for the weather data API
- [React Leaflet](https://react-leaflet.js.org/) for the map components
- [OpenStreetMap](https://www.openstreetmap.org/) and [CARTO](https://carto.com/) for map tiles