import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { CheckCircle } from "@mui/icons-material";

export default function ChannelCard({ channelDetail, marginTop }) {
    return (
        <Box sx={{
            boxShadow: 'none',
            borderRadius: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: { xs: '356px', md: '320px' },
            height: '326px',
            margin: 'auto',
            marginTop: marginTop
        }}>
            <Link to={`/channel/${channelDetail?.id?.channelId}`}>
                <CardContent sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: '#fff',
                    padding: '20px'
                }}>
                    <CardMedia
                        image={channelDetail?.snippet?.thumbnails?.high?.url}
                        alt={channelDetail?.snippet?.title}
                        sx={{
                            borderRadius: '50%',
                            height: '180px',
                            width: '180px',
                            mb: 2,
                            border: '1px solid #e3e3e3',
                            margin: 'auto'
                        }}
                    />
                    <Typography variant="h6" sx={{
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                    }}>
                        {channelDetail?.snippet?.title}
                        <CheckCircle sx={{ fontSize: '14px', color: 'gray', ml: '5px' }} />
                    </Typography>
                    {channelDetail?.statistics?.subscriberCount && (
                        <Typography sx={{ color: 'gray' }}>
                            {parseInt(channelDetail?.statistics?.subscriberCount).toLocaleString('en-US')} Subscribers
                        </Typography>
                    )}
                    <Typography variant="body2" color="gray" sx={{ mt: 1, textAlign: 'center', maxWidth: '300px' }}>
                        {channelDetail?.snippet?.description?.slice(0, 100)}...
                    </Typography>
                </CardContent>
            </Link>
        </Box>
    );
}

ChannelCard.propTypes = {
    channelDetail: PropTypes.object.isRequired,
    marginTop: PropTypes.string
};
