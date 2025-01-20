import Feed from "./components/Feed"
import Videos from './components/Videos.jsx'
import VideoDetail from './components/VideoDetail.jsx'
import SearchFeed from './components/SearchFeed.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ChannelDetail from "./components/ChannelDetail.jsx"
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme/theme';

function App() {


    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' exact element={<Feed />}></Route>
                    <Route path='/videos' exact element={<Videos />}></Route>
                    <Route path='/video/:videoId' exact element={<VideoDetail />}></Route>
                    <Route path='/search/:searchTerm' exact element={<SearchFeed />}></Route>
                    <Route path='/channel/:channelId' element ={<ChannelDetail></ChannelDetail>}></Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
