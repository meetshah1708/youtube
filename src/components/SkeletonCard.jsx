import { Card, CardContent, Skeleton, Box } from "@mui/material";

export default function SkeletonCard() {
    return (
        <Card sx={{
            width: { xs: '100%', sm: '358px', md: "320px" },
            boxShadow: 'none',
            borderRadius: 0
        }}>
            <Skeleton
                variant="rectangular"
                width="100%"
                height={180}
                animation="wave"
                sx={{ bgcolor: 'grey.800' }}
            />
            <CardContent sx={{ backgroundColor: '#1e1e1e', height: '106px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Skeleton
                        variant="text"
                        width="90%"
                        height={24}
                        animation="wave"
                        sx={{ bgcolor: 'grey.800' }}
                    />
                    <Skeleton
                        variant="text"
                        width="60%"
                        height={20}
                        animation="wave"
                        sx={{ bgcolor: 'grey.800' }}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Skeleton
                            variant="text"
                            width={50}
                            height={20}
                            animation="wave"
                            sx={{ bgcolor: 'grey.800' }}
                        />
                        <Skeleton
                            variant="text"
                            width={50}
                            height={20}
                            animation="wave"
                            sx={{ bgcolor: 'grey.800' }}
                        />
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
} 