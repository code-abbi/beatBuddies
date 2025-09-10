<h1 align="center">Realtime Music testing Application ✨</h1>

# BeatBuddies 🎧
The ultimate feedback loop for your next hit. BeatBuddy is a full-stack, real-time music sharing application for artists to get instant feedback on their tracks from a trusted circle.
#
✨ Core Features
-🎵 Dynamic Music Player: Listen to music, control playback (play, pause, next, previous), and update the volume with a slider.

-🎧 Admin Dashboard: A dedicated panel for administrators to create and manage albums and songs.

-💬 Real-time Chat: An integrated chat allows for instant collaboration and feedback on tracks.

-👨🏼‍💼 Live User Status: See who is online/offline with real-time presence indicators.

-👀 Friends Activity: See what other users are listening to at any given moment.

-📊 Platform Analytics: The admin dashboard includes aggregate data for total songs, albums, artists, and users.

#
🚀 Getting Started

-Clone the repository:
```bash
git clone <https://github.com/code-abbi/beatBuddies.git>
cd beatBuddies
```

-Install dependencies:
Run this command from the root directory to install dependencies for both the frontend and backend.

```bash
npm install
```
-Setup Backend .env
Navigate to the backend folder, create a .env file, and add the following variables:
```bash
PORT=8000
MONGODB_URI=...
ADMIN_EMAIL=...
NODE_ENV=development

# Cloudinary Keys
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_CLOUD_NAME=...

# Clerk Keys
CLERK_SECRET_KEY=...
```
-Setup Frontend .env
```bash
VITE_CLERK_PUBLISHABLE_KEY=...
VITE_API_URL=http://localhost:8000/api
```

- Run the Application
You will need two separate terminals open.

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```
Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
#
- ☁️ Deployment
This monorepo is configured for an easy single-server deployment. On a platform like Render, you can deploy the entire project as one Web Service, using the build and start commands from the root package.json file