import { Paper, InputBase, IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

export default function SearchBar() {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            navigate(`/search/${searchTerm}`);
            setSearchTerm('');
        }
    };

    return (
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
                sx={{
                    flex: 1,
                    color: theme.palette.text.primary
                }}
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
    );
}
