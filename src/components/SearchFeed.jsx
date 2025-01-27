import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Box, Typography, Container } from '@mui/material'
import Videos from './Videos'
import Navbar from "./Navbar"
import LoadingSpinner from "./LoadingSpinner"
import { useTheme } from '@mui/material/styles'
import { useAuth } from '../contexts/AuthContext'

export default function SearchFeed() {
    const [ videos, setVideos ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState(null)
    const { searchTerm } = useParams()
    const theme = useTheme()
    const { user } = useAuth()
    const key = import.meta.env.VITE_RAPID_API_YOUTUBE_KEY

    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true)
                setError(null)
                
                const response = await fetch(
                    `https://youtube-v31.p.rapidapi.com/search?part=snippet&q=${searchTerm}&maxResults=50`,
                    {
                        headers: {
                            'X-RapidAPI-Key': key,
                            'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
                        }
                    }
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch search results')
                }

                const data = await response.json()
                if (!data.items) {
                    throw new Error('No results found')
                }

                setVideos(data.items)
            } catch (error) {
                console.error("Error fetching search results:", error)
                setError(error.message)
            } finally {
                setIsLoading(false)
            }
        }

        if (searchTerm && key) {
            getData()
        }
    }, [ searchTerm, key ])

    if (error) {
        return (
            <Box 
                sx={{ 
                    minHeight: '95vh',
                    backgroundColor: theme.palette.background.default
                }}
            >
                <Navbar />
                <Container 
                    maxWidth="xl" 
                    sx={{ 
                        pt: { xs: 10, sm: 12 },
                        pb: 4
                    }}
                >
                    <Typography color="error" variant="h6" align="center">
                        {error}
                    </Typography>
                </Container>
            </Box>
        )
    }

    return (
        <Box 
            sx={{ 
                minHeight: '95vh',
                backgroundColor: theme.palette.background.default
            }}
        >
            <Navbar />
            <Container 
                maxWidth="xl" 
                sx={{ 
                    pt: { xs: 10, sm: 12 },
                    pb: 4
                }}
            >
                {isLoading ? (
                    <LoadingSpinner message="Searching..." />
                ) : (
                    <>
                        <Typography 
                            variant="h4" 
                            sx={{
                                fontWeight: 'bold',
                                mb: 3,
                                color: theme.palette.text.primary
                            }}
                        >
                            Search results for{' '}
                            <span style={{ color: theme.palette.primary.main }}>
                                {searchTerm}
                            </span>
                        </Typography>

                        {videos?.length === 0 ? (
                            <Typography 
                                variant="h6"
                                sx={{ 
                                    color: theme.palette.text.secondary,
                                    textAlign: 'center',
                                    mt: 4
                                }}
                            >
                                No results found for "{searchTerm}"
                            </Typography>
                        ) : (
                            <Videos videos={videos} />
                        )}
                    </>
                )}
            </Container>
        </Box>
    )
}
