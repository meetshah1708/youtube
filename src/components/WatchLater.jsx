
import PropTypes from 'prop-types';

/**
 * Sample video data structure:
 * {
 *   id: string,
 *   title: string,
 *   thumbnailUrl: string,
 *   description: string,
 *   ...
 * }
 */

function VideoItem({ video, onAddToWatchLater }) {
    return (
        <div style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
            <img src={video.thumbnailUrl} alt={video.title} style={{ width: '100px' }} />
            <h3>{video.title}</h3>
            <p>{video.description}</p>
            <button onClick={() => onAddToWatchLater(video)}>Watch Later</button>
        </div>
    );
}

VideoItem.propTypes = {
    video: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        thumbnailUrl: PropTypes.string.isRequired,
        description: PropTypes.string,
    }).isRequired,
    onAddToWatchLater: PropTypes.func.isRequired,
};

function WatchLaterList({ videos }) {
    return (
        <div style={{ border: '1px solid #aaa', padding: '1rem', marginTop: '2rem' }}>
            <h2>Watch Later</h2>
            {videos.length === 0 ? (
                <p>No videos saved for later.</p>
            ) : (
                videos.map((video) => (
                    <div key={video.id} style={{ marginBottom: '1rem' }}>
                        <strong>{video.title}</strong>
                    </div>
                ))
            )}
        </div>
    );
}

WatchLaterList.propTypes = {
    videos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            thumbnailUrl: PropTypes.string.isRequired,
            description: PropTypes.string,
        }),
    ).isRequired,
};

export default function HomePage() {
    const [videos] = useState([
        {
            id: 'video1',
            title: 'Sample Video 1',
            thumbnailUrl: 'https://via.placeholder.com/200x100',
            description: 'An example of a video description.',
        },
        {
            id: 'video2',
            title: 'Sample Video 2',
            thumbnailUrl: 'https://via.placeholder.com/200x100',
            description: 'Another sample video description.',
        },
        // ... add more videos as needed
    ]);

    const [watchLater, setWatchLater] = useState([]);

    const handleAddToWatchLater = (video) => {
        if (!watchLater.find((item) => item.id === video.id)) {
            setWatchLater([...watchLater, video]);
        }
    };

    return (
        <div style={{ margin: '2rem' }}>
            <h1>Your YouTube Clone</h1>
            <h2>All Videos</h2>
            {videos.map((video) => (
                <VideoItem key={video.id} video={video} onAddToWatchLater={handleAddToWatchLater} />
            ))}

            <WatchLaterList videos={watchLater} />
        </div>
    );
}