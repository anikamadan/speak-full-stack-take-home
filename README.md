# Speak Full Stake Take Home
Created by Anika Madan

A full-stack language learning application that enables users to practice speaking through interactive lessons with real-time speech-to-text transcription.

## Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher (comes with Node.js)
- **Modern web browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/anikamadan/speak-full-stack-take-home.git
cd speak-full-stack-take-home
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Install client dependencies

```bash
cd ../client
npm install
```

## How to Run the Application

### Start the Backend Server

From the `server` directory:

```bash
npm run dev
```

The server will start on `http://localhost:3001` and provide:
- REST API endpoints for courses and lessons
- WebSocket server at `ws://localhost:3001/ws` for real-time speech transcription

### Start the Frontend Client

From the `client` directory (in a new terminal):

```bash
npm run dev
```

The client will start on `http://localhost:5173` (or another available port). Open this URL in your browser to access the application.

### Full startup sequence

```bash
# Terminal 1: Start the server
cd server
npm run dev

# Terminal 2: Start the client
cd client
npm run dev
```

Then navigate to `http://localhost:5173` in your browser.

## Environment Variables & Configuration

### Server Configuration

The server uses the following default settings:

- **API Base URL**: `http://localhost:3001`
- **WebSocket URL**: `ws://localhost:3001/ws`
- **Port**: 3001 (can be modified in `server/src/index.js`)

### Client Configuration

The client connects to the backend using:

- **API Base URL**: `http://localhost:3001` (defined in `client/src/api.js`)
- **WebSocket URL**: `ws://localhost:3001/ws` (defined in `client/src/pages/Lesson.jsx`)

To change the API endpoint, update the `API_BASE` constant in:
- `client/src/api.js`
- `client/src/pages/Lesson.jsx`

## Project Structure

```
speak-full-stack-take-home/
├── assets/
│   ├── audio.json          # Sample audio data for testing
│   └── course.json         # Course and lesson content data
├── server/
│   ├── src/
│   │   ├── index.js        # Server entry point
│   │   ├── courses.js      # Course data handling
│   │   └── speakProxy.js   # WebSocket proxy for transcription
│   ├── package.json
│   └── README.md
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Courses.jsx       # Main courses listing page
│   │   │   ├── Courses.css       # Large card layouts with scroll animation
│   │   │   ├── CourseDetails.jsx # Lesson checkpoints page
│   │   │   ├── CourseDetails.css
│   │   │   ├── Lesson.jsx        # Recording and transcription page
│   │   │   ├── Lesson.css
│   │   │   └── Layout.jsx        # Navigation bar layout
│   │   ├── api.js          # API utilities
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   ├── vite.config.js      # Vite configuration
│   └── README.md
├── README.md
└── package.json
```

## Key Features

- **Course Browsing**: Large, interactive course cards with scroll animations
- **Lesson Checkpoints**: Track progress through course lessons with completion checkmarks
- **Speech Recording**: Click the microphone button to record and get real-time transcription
- **Live Transcription**: See translations appear in real-time as you speak
- **Recording State Indicator**: Page background changes to light blue during recording
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Scripts

### Server Scripts

- `npm run dev` - Start the development server

### Client Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Troubleshooting

### Port Already in Use

If port 3001 (server) or 5173 (client) is already in use:

1. **Server (port 3001)**: Modify the port in `server/src/index.js`
2. **Client (port 5173)**: Vite will automatically use the next available port

### WebSocket Connection Errors

Ensure both server and client are running and the WebSocket URL matches:
- Server: `ws://localhost:3001/ws`
- Client should connect to the same URL

### CORS Issues

The server includes CORS configuration. If you encounter CORS errors, verify:
- Server is running on port 3001
- Client is on port 5173
- Both are running on `localhost`

## Development

### Stack

- **Frontend**: React 19, Vite, React Router
- **Backend**: Express.js, WebSocket (ws)
- **Styling**: CSS with CSS variabless