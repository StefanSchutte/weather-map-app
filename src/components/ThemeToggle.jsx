import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle() {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <button
            className={`theme-toggle ${darkMode ? 'dark' : ''}`}
            onClick={toggleTheme}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {darkMode ? '☀️' : '🌙'}
        </button>
    );
}

export default ThemeToggle;