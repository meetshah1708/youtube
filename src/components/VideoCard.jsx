import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import PropTypes from 'prop-types'
import { CheckCircle } from "@mui/icons-material";

export default function VideoCard({ video: { id: { videoId }, snippet } }) {
    //console.log(videoId,snippet)
    return (
        <Card sx={{maxWidth :{xs:'100%',md:"308px"}}} >
            <Link to={`/video/${videoId}`}>
                <CardMedia
                    image={snippet?.thumbnails?.default?.url}
                    alt={snippet?.title}
                    sx={{ height: 170 }}
                >
                    
                </CardMedia>
            </Link>
            <CardContent sx={{
                backgroundColor: '#1e1e1e', height: '108px',
           
            }}>
                <NavLink to={`/video/${videoId}`}>
                    <Typography
                        variant="subtitle2" fontWeight='bold'
                        color='#fff'
                    >
                        {/* {console.log(snippet,videoId)} */}
                        {snippet?.title?.slice(0, 60)}
                    </Typography>
                     </NavLink>
                    <NavLink to={`/channel/${snippet?.channelId}`}>
                        
                    <Typography>
                            {snippet?.channelTitle}
                            <span style={{alignItems:'center',paddingLeft:'20px',marginTop:'2px'}}><CheckCircle/></span>
                    </Typography>
                    </NavLink>
               
            </CardContent>
        </Card >


    )
}
VideoCard.propTypes = {
    video: PropTypes.any,
    snippet: PropTypes.any

}
