import {
    Box,
    ClickAwayListener,
    Divider,
    IconButton,
    InputBase,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Popper,
    Typography,
} from "@mui/material";
import { Close, History, Search } from "@mui/icons-material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

export default function SearchBar() {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const anchorRef = useRef(null);
    const storageKey = 'metube.recentSearches';

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored));
            } catch (error) {
                console.warn('Failed to parse recent searches:', error);
                localStorage.removeItem(storageKey);
            }
        }
    }, []);

    const suggestions = useMemo(
        () => recentSearches.filter((term) => term.toLowerCase().includes(searchTerm.toLowerCase())),
        [recentSearches, searchTerm]
    );

    const persistSearches = (nextSearches) => {
        setRecentSearches(nextSearches);
        localStorage.setItem(storageKey, JSON.stringify(nextSearches));
    };

    const addSearchTerm = (term) => {
        const cleaned = term.trim();
        if (!cleaned) {
            return;
        }
        const nextSearches = [cleaned, ...recentSearches.filter((item) => item !== cleaned)].slice(0, 6);
        persistSearches(nextSearches);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleaned = searchTerm.trim();
        if (cleaned) {
            addSearchTerm(cleaned);
            navigate(`/search/${cleaned}`);
            setSearchTerm('');
            setIsOpen(false);
        }
    };

    return (
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <Box sx={{ position: 'relative' }}>
                <Paper
                    component="form"
                    onSubmit={handleSubmit}
                    ref={anchorRef}
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
                        sx={{
                            flex: 1,
                            color: theme.palette.text.primary
                        }}
                        placeholder="Search..."
                        value={searchTerm}
                        onFocus={() => setIsOpen(true)}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsOpen(true);
                        }}
                        aria-label="Search videos"
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
                <Popper
                    open={isOpen && recentSearches.length > 0}
                    anchorEl={anchorRef.current}
                    placement="bottom-start"
                    sx={{ zIndex: theme.zIndex.appBar + 1, width: anchorRef.current?.offsetWidth }}
                >
                    <Paper
                        sx={{
                            mt: 1,
                            borderRadius: 2,
                            boxShadow: theme.shadows[4],
                            backgroundColor: theme.palette.background.paper,
                        }}
                    >
                        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>
                                Recent searches
                            </Typography>
                            <IconButton
                                size="small"
                                aria-label="Clear recent searches"
                                onClick={() => {
                                    persistSearches([]);
                                    setIsOpen(false);
                                }}
                            >
                                <Close fontSize="small" />
                            </IconButton>
                        </Box>
                        <Divider />
                        <List dense sx={{ maxHeight: 240, overflowY: 'auto' }}>
                            {(suggestions.length > 0 ? suggestions : recentSearches).map((term) => (
                                <ListItemButton
                                    key={term}
                                    onClick={() => {
                                        addSearchTerm(term);
                                        navigate(`/search/${term}`);
                                        setSearchTerm('');
                                        setIsOpen(false);
                                    }}
                                >
                                    <History fontSize="small" style={{ marginRight: 12 }} />
                                    <ListItemText primary={term} />
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>
                </Popper>
            </Box>
        </ClickAwayListener>
    );
}
