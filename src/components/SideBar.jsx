import PropTypes from "prop-types";
import { categories } from "../assets/youtube";
import { Stack, Button, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';

const SideBar = ({ setSelectedCategory, selectedCategory }) => {
    const theme = useTheme();
    
    return (
        <Stack
            sx={{
                overflowY: "auto",
                height: { xs: "auto", md: "95vh" },
                flexDirection: { md: "column" },
                bgcolor: theme.palette.background.paper,
                paddingTop: '70px',
            }}
        >
            {categories.map((cat) => (
                <Button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        backgroundColor: cat.name === selectedCategory ? 
                            theme.palette.primary.main : "transparent",
                        color: cat.name === selectedCategory ? 
                            '#fff' : theme.palette.text.primary,
                        textTransform: 'none',
                        padding: '10px 20px',
                        '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                            color: '#fff'
                        }
                    }}
                >
                    <i className={cat.icon} aria-hidden="true" style={{ marginRight: '15px' }}></i>
                    {cat.name}
                </Button>
            ))}
            
            <Typography 
                variant="caption" 
                sx={{ 
                    marginTop: '20px', 
                    textAlign: 'center', 
                    color: theme.palette.text.secondary, 
                    padding: '10px' 
                }}
            >
                © MeetEnterprise
            </Typography>
        </Stack>
    );
}

SideBar.propTypes = {
    selectedCategory: PropTypes.string.isRequired,
    setSelectedCategory: PropTypes.func.isRequired
}

export default SideBar;
