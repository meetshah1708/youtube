import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Box, Typography, Container } from '@mui/material'
import Videos from './Videos'
import LoadingSpinner from "./LoadingSpinner"
import { useTheme } from '@mui/material/styles'
import { fetchApi } from '../assets/FetchApi'

export default function SearchFeed() {
    const [ videos, setVideos ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ error, setError ] = useState(null)
    const { searchTerm } = useParams()
    const theme = useTheme()
    const key = import.meta.env.VITE_RAPID_API_YOUTUBE_KEY

    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true)
                setError(null)
                
                const data = await fetchApi(`https://youtube-v311.p.rapidapi.com/search?part=snippet&q=${searchTerm}&maxResults=50`)

                if (!data || !data.items) {
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
            <Container
                maxWidth="xl"
                sx={{ 
                    py: 4
                }}
            >
                <Typography color="error" variant="h6" align="center">
                    {error}
                </Typography>
            </Container>
        )
    }

    return (
        <Container
            maxWidth="xl"
            sx={{ 
                py: 4
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

                    {videos.length === 0 ? (
                        <Typography 
                            variant="h6"
                            sx={{
                                color: theme.palette.text.secondary,
                                textAlign: 'center',
                                mt: 4
                            }}
                        >
                            No results found for &quot;{searchTerm}&quot;
                        </Typography>
                    ) : (
                        <Videos videos={videos} />
                    )}
                </>
            )}
        </Container>
    )
}
