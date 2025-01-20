import PropTypes from "prop-types";
import { categories } from "../assets/youtube";
import { Stack, Button } from "@mui/material";

const SideBar = ({ setSelectedCategory, selectedCategory }) => {
    return (
        <Stack
            sx={{
                overflowY: "auto",
                height: { xs: "auto", md: "95vh" },
                flexDirection: { md: "column" },
                bgcolor: '#000',
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
                        backgroundColor: cat.name === selectedCategory ? "#fc1503" : "transparent",
                        color: "white",
                        textTransform: 'none',
                        padding: '10px 20px',
                        '&:hover': {
                            backgroundColor: "#fc1503",
                        }
                    }}
                >
                    <i className={cat.icon} aria-hidden="true" style={{ marginRight: '15px' }}></i>
                    {cat.name}
                </Button>
                
            ))}
            
                <div style={{ marginTop: '20px', textAlign: 'center', color: 'white', padding: '10px' }}>
                    © MeetEnterprise
                </div>
        </Stack>
    );
}

SideBar.propTypes = {
    selectedCategory: PropTypes.string.isRequired,
    setSelectedCategory: PropTypes.func.isRequired
}

export default SideBar;
