import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types'

export default function ChannelCard({ channelDetail }) {
    return (
        <Card sx={{ width: { md: '300px', xs: '100%' } }}>
            <Link to={`/channel/${channelDetail?.snippet?.channelId}`}>
                <CardMedia
                    image={channelDetail?.snippet?.thumbnails?.default?.url}
                    sx={{ width: { md: '300px', xs: '100%' }, height: 270 ,objectFit:"contain"}}
                >
                </CardMedia>
            </Link>
            <CardContent sx={{ backgroundColor: '#1e1e1e', height: '108px', width: { md: '320px', xs: '100%' } }}>

                <Typography
                    variant="h3" fontWeight='bold'
                    color='#fff'
                >
                    {channelDetail?.snippet?.title.slice(0, 60)}
                </Typography>

            </CardContent>
        </Card >


    )
}
ChannelCard.propTypes = {
    channelDetail: PropTypes.any,
    snippet: PropTypes.any,
    items: PropTypes.any

}
