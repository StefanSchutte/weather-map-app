import { createContext, useState, useContext, useEffect } from 'react';

/**
 * Context for theme-related data and functions.
 * @type {React.Context}
 */
const ThemeContext = createContext();

/**
 * Custom hook for accessing the theme context.
 * @returns {Object} The theme context value containing:
 * @returns {boolean} darkMode - Current theme state (true for dark mode, false for light mode)
 * @returns {Function} toggleTheme - Function to toggle between light and dark modes
 */
export const useTheme = () => useContext(ThemeContext);

/**
 * Provider component for theme context.
 * Handles theme state management, local storage persistence, and body class updates.
 * Initializes from local storage if available, defaults to false (light mode).
 * Effect to persist theme preference to localStorage and update body class whenever the theme changes.
 * @component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components that will have access to theme context
 * @returns {JSX.Element} ThemeContext Provider with value containing the theme state and toggle function
 */
export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('darkMode');
        return savedTheme ? JSON.parse(savedTheme) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
