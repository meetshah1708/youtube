import { useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorModeContext } from '../contexts/ThemeContext';

/**
 * Custom hook that registers global keyboard shortcuts for navigation.
 * Shortcuts are disabled when the user is typing in an input/textarea.
 *
 * @param {Object} options
 * @param {Function} options.onOpenHelp - Callback to open the shortcuts help dialog
 */
export default function useKeyboardShortcuts({ onOpenHelp } = {}) {
    const navigate = useNavigate();
    const colorMode = useContext(ColorModeContext);

    const handleKeyDown = useCallback((e) => {
        // Don't trigger shortcuts when typing in inputs
        const tag = e.target.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
            return;
        }

        // Don't trigger when modifier keys are held (except Shift for ?)
        if (e.ctrlKey || e.metaKey || e.altKey) {
            return;
        }

        switch (e.key) {
            case '/':
                e.preventDefault();
                // Focus the search bar input
                const searchInput = document.querySelector('[data-shortcut-search]');
                if (searchInput) searchInput.focus();
                break;
            case 'h':
                navigate('/');
                break;
            case 't':
                navigate('/trending');
                break;
            case 'w':
                navigate('/watch-later');
                break;
            case 'y':
                navigate('/history');
                break;
            case 'l':
                navigate('/liked-videos');
                break;
            case 'p':
                navigate('/playlists');
                break;
            case 'd':
                colorMode.toggleColorMode();
                break;
            case '?':
                if (onOpenHelp) onOpenHelp();
                break;
            default:
                break;
        }
    }, [navigate, colorMode, onOpenHelp]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}
