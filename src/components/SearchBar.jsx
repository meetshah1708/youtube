import { Paper, InputBase, IconButton, Box, Typography, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, ClickAwayListener } from "@mui/material";
import { Search, History, Close, DeleteSweep } from "@mui/icons-material";
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { useSearchHistory } from '../contexts/SearchHistoryContext';

export default function SearchBar() {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const { addSearchTerm, removeSearchTerm, clearSearchHistory, getFilteredHistory } = useSearchHistory();

    const suggestions = getFilteredHistory(searchTerm);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            addSearchTerm(searchTerm);
            navigate(`/search/${searchTerm}`);
            setSearchTerm('');
            setShowSuggestions(false);
            setSelectedIndex(-1);
        }
    };

    const handleSuggestionClick = useCallback((term) => {
        addSearchTerm(term);
        navigate(`/search/${term}`);
        setSearchTerm('');
        setShowSuggestions(false);
        setSelectedIndex(-1);
    }, [addSearchTerm, navigate]);

    const handleRemoveSuggestion = useCallback((e, term) => {
        e.stopPropagation();
        removeSearchTerm(term);
    }, [removeSearchTerm]);

    const handleKeyDown = (e) => {
        if (!showSuggestions || suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleSuggestionClick(suggestions[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setSelectedIndex(-1);
        }
    };

    const handleFocus = () => {
        setShowSuggestions(true);
    };

    const handleClickAway = () => {
        setShowSuggestions(false);
        setSelectedIndex(-1);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box sx={{ position: 'relative' }}>
                <Paper
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        borderRadius: 20,
                        border: `1px solid ${theme.palette.divider}`,
                        pl: 2,
                        boxShadow: 'none',
                        mr: { sm: 5 },
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: theme.palette.background.paper
                    }}
                >
                    <InputBase
                        ref={inputRef}
                        sx={{
                            flex: 1,
                            color: theme.palette.text.primary
                        }}
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowSuggestions(true);
                            setSelectedIndex(-1);
                        }}
                        onFocus={handleFocus}
                        onKeyDown={handleKeyDown}
                        inputProps={{ 'data-shortcut-search': true }}
                    />
                    <IconButton 
                        type="submit"
                        sx={{ 
                            p: '10px',
                            color: theme.palette.primary.main
                        }}
                    >
                        <Search />
                    </IconButton>
                </Paper>

                {showSuggestions && suggestions.length > 0 && (
                    <Paper
                        sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: { sm: 40 },
                            mt: 0.5,
                            borderRadius: 2,
                            bgcolor: theme.palette.background.paper,
                            border: `1px solid ${theme.palette.divider}`,
                            zIndex: 1300,
                            maxHeight: 320,
                            overflowY: 'auto',
                            boxShadow: theme.shadows[8],
                        }}
                    >
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            px: 2,
                            pt: 1,
                            pb: 0.5
                        }}>
                            <Typography variant="caption" color="text.secondary">
                                Recent searches
                            </Typography>
                            {!searchTerm && (
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        clearSearchHistory();
                                        setShowSuggestions(false);
                                    }}
                                    sx={{ 
                                        color: theme.palette.text.secondary,
                                        '&:hover': { color: theme.palette.error.main }
                                    }}
                                    title="Clear all search history"
                                >
                                    <DeleteSweep fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                        <List dense sx={{ py: 0 }}>
                            {suggestions.map((term, index) => (
                                <ListItem
                                    key={term}
                                    onClick={() => handleSuggestionClick(term)}
                                    sx={{
                                        cursor: 'pointer',
                                        bgcolor: index === selectedIndex 
                                            ? theme.palette.action.selected 
                                            : 'transparent',
                                        '&:hover': {
                                            bgcolor: theme.palette.action.hover,
                                        },
                                        pr: 6,
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <History fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={term}
                                        primaryTypographyProps={{
                                            noWrap: true,
                                            sx: { color: theme.palette.text.primary }
                                        }}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton
                                            edge="end"
                                            size="small"
                                            onClick={(e) => handleRemoveSuggestion(e, term)}
                                            sx={{ 
                                                color: theme.palette.text.secondary,
                                                '&:hover': { color: theme.palette.error.main }
                                            }}
                                            title="Remove from search history"
                                        >
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>
        </ClickAwayListener>
    );
}
