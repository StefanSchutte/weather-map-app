# Weather Map Application (Vite)

## Overview
A React application built with Vite that displays weather information for locations selected on an interactive map using React Leaflet and OpenWeatherMap API.

## Setup
1. Clone the repository
2. Run `npm install`
3. Get an API key from [OpenWeatherMap](https://openweathermap.org/api)
4. Replace `YOUR_OPENWEATHERMAP_API_KEY` in `src/components/Map.jsx` with your API key
5. Run `npm run dev` to start the development server

## Dependencies
- React
- React Leaflet
- Axios
- Sass
- Vite

## Features
- Interactive world map with click-to-view weather
- Weather details display (temperature, description, humidity, wind speed)
- Error handling for API requests
- Responsive design

## Assumptions
- Users have a stable internet connection
- OpenWeatherMap free tier API is sufficient for basic usage