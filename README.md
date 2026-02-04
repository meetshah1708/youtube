# METube (YouTube Clone)

A modern YouTube-style video experience built with React, Vite, and Material UI. METube supports authenticated access, search, watch-later lists, and an improved search experience with recent-search history.

## ✨ Features
- **Video discovery** with category feeds and search.
- **Recent search history** stored locally for quick re-searching.
- **Watch Later** list to save videos for later viewing.
- **Authentication flows** with protected routes.
- **Dark mode** toggle for accessibility and comfort.

## 🧱 Tech Stack
- React + Vite
- Material UI
- React Router
- RapidAPI (YouTube v3.1.1)

## ✅ Production Readiness Checklist
- Environment variables moved to `.env` (example provided).
- API keys and secrets are excluded from version control.
- Build scripts and preview steps documented.

## 🚀 Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
Create a local `.env` file based on `.env.example`.
```bash
cp .env.example .env
```

Required variables:
- `VITE_RAPID_API_YOUTUBE_KEY` — RapidAPI key for YouTube v3.1.1
- `MONGODB_URI` — MongoDB connection string (if using backend services)
- `JWT_SECRET` — secret for JWT signing (if using backend services)
- `PORT` — backend port (defaults to 5000)
- `MODE` — runtime mode (`production` recommended for deployment)

### 3) Start the development server
```bash
npm run dev
```

## 🏗️ Build & Preview (Production)
```bash
npm run build
npm run preview
```

## 📂 Project Structure
```
src/
  components/     # Reusable UI components
  contexts/       # React contexts for app state
  hooks/          # Custom React hooks
  styles/         # Shared styling
  theme/          # Theme configuration
```

## 📦 Scripts
| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run lint checks |

## 🧩 Deployment Notes
- Ensure `.env` variables are configured in your hosting provider.
- Use `npm run build` to create the production bundle.
- Serve the `dist/` folder with a static host (Netlify, Vercel, etc.).

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License
MIT
