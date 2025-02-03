import React, { useState } from 'react';
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

# YouTube Clone React Application

## 📝 Project Overview
A modern YouTube clone built with React and Vite, offering a seamless video streaming experience.

## 🚀 Tech Stack
- React.js
- JavaScript (94.6%)
- CSS (4.0%)
- HTML (1.4%)
- Vite (Build Tool)

## ⚙️ Features
- Hot Module Replacement (HMR)
- React Integration
- Modern Development Environment
- Fast Refresh Support

## 🛠️ Installation & Setup
```bash
# Clone the repository
git clone https://github.com/meetshah1708/youtube.git

# Navigate to project directory
cd youtube

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Project Structure
```
youtube/
├── src/
│   ├── components/
│   ├── assets/
│   └── App.jsx
├── package.json
├── vite.config.js
└── index.html
```

## 📦 Scripts
```json
{
  "dev": "Start development server",
  "build": "Build for production",
  "preview": "Preview production build"
}
```

## 🔧 Configuration
- ESLint configured for code quality
- Vite optimized build setup
- React-specific optimization

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License
This project is licensed under the MIT License

## 📞 Contact
- GitHub: [@meetshah1708](https://github.com/meetshah1708)


