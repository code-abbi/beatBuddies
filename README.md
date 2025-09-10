<h1 align="center">Realtime Music testing Application ✨</h1>

![Demo App](/frontend/public/1)
![Demo App](/frontend/public/2)
![Demo App](/frontend/public/3)

# BeatBuddies 🎧

The ultimate feedback loop for your next hit. BeatBuddy is a full-stack, real-time music sharing application for artists to get instant feedback on their tracks from a trusted circle.

✨ Core Features
🎵 Secure Uploads: Artists can upload tracks and cover art, hosted securely on Cloudinary.

💬 Real-Time Chat: Get instant, one-on-one feedback on your music with a live chat system built with Socket.IO.

👀 Live Friends Activity: See what your friends are listening to in real-time.

🛡️ Admin Dashboard: A dedicated panel for administrators to manage all content and view application stats.

🎨 Modern UI: A sleek, dark-themed interface built with React, Vite, Tailwind CSS, and Shadcn/UI.

🛠️ Tech Stack
Frontend: React, TypeScript, Vite, Tailwind CSS, Zustand

Backend: Node.js, Express.js, MongoDB, Socket.IO

Services: Clerk (Authentication), Cloudinary (Media Hosting)

🚀 Getting Started
Clone the repository:

Bash

git clone [https://github.com/code-abbi/beatBuddies.git]
cd beatBuddies
Install all dependencies:
(This installs for both frontend and backend from the root)

Bash

npm install
Set up Environment Variables:

In both the frontend and backend folders, copy the .env.sample file to a new file named .env.

Fill in your secret keys (MongoDB URI, Clerk, Cloudinary, etc.).

Run the Development Servers:

You will need two separate terminals.

Terminal 1 (Backend):

Bash

cd backend && npm run dev
Terminal 2 (Frontend):

Bash

cd frontend && npm run dev
☁️ Deployment
This monorepo is configured for an easy single-server deployment. On a platform like Render, you can deploy the entire project as one Web Service, using the build and start commands from the root package.json file.