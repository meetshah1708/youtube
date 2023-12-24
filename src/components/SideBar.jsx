
import  PropTypes  from "prop-types";

import { categories } from "../assets/youtube";
import { Stack } from "@mui/material";
 //import { useEffect } from "react";

const SideBar = ({ setSelectedCategory, selectedCategory }) => {
    // useEffect(() => {   //to solve cannot update one component while rendering other component
    //     setSelectedCategory(" ") // here not necessary
    // },[setSelectedCategory])
    const handleSelection = (props) => {
        setSelectedCategory(props)
};
    return (
        <Stack
            sx={{
                overflowY: "auto",
                height: { xs: "auto", md: "95%" },
                flexDirection: { md: "column" },
            }}
        >
            {categories.map((cat) => {//or else add ()

                return (//always remember  to add return in map 
                    <button
                        onClick={() => {
                            handleSelection(cat.name)
                        }}
                        style={{
                            backgroundColor: cat.name === selectedCategory ? "#fc1503" : "#000",
                            color: "white",
                            padding: 20,

                        }}
                        key={cat.name}
                    >
                        <span
                            style={{
                                color: cat.name === selectedCategory ? "white" : "red",
                                marginRight: "15px",
                            }}
                        >
                            <i className={cat.icon} aria-hidden="true"></i>

                        </span>

                        <span
                            style={{
                                opacity: cat.name === selectedCategory ?
                                    1 : 0.8
                            }}
                        >
                            {cat.name}
                        </span>
                    </button>
                )
            })}
        </Stack>

    );
}
SideBar.propTypes = {
    selectedCategory: PropTypes.node,
     setSelectedCategory : PropTypes.func
}

export default SideBar;
