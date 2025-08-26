<h1 align="center">Realtime Music testing Application ✨</h1>

![Demo App](/frontend/public/screenshot-for-readme.png)

# BeatBuddies 🎧

![BeatBuddies Logo](frontend/public/logo.png)

**The ultimate feedback loop for your next hit. BeatBuddies is a full-stack, real-time music sharing application designed for artists, producers, and creators to get instant feedback on their tracks from a trusted circle.**

---

### ✨ Key Features

-   **Secure Authentication**: Role-based user and admin authentication powered by **Clerk**, ensuring that your work is always private and secure.
-   **Direct Audio Uploads**: Artists can upload their songs and cover art directly from their computer, hosted securely on **Cloudinary**.
-   **Album & Project Organization**: Group your uploaded tracks into albums or EPs to keep your catalog organized.
-   **Real-Time Chat**: A live, one-on-one chat system built with **Socket.IO** for instant, time-stamped feedback and collaboration.
-   **Live Friends Activity**: See what your connected friends are listening to in real-time, creating a more social and engaging experience.
-   **Admin Dashboard**: A dedicated panel for administrators to view application stats (total users, songs, albums) and manage all user-uploaded content.
-   **Modern & Dynamic UI**: A sleek, dark-themed interface built with **React**, **Vite**, and styled with **Tailwind CSS** and **Shadcn/UI**.

---

### 🛠️ Tech Stack

| Category      | Technology / Service                                     |
| :------------ | :------------------------------------------------------- |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Shadcn/UI, Zustand  |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, Socket.IO        |
| **Services** | Clerk (Authentication), Cloudinary (Media Hosting)       |
| **Deployment**| Render (or any other Node.js/Static hosting service)   |

---

### 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

#### Prerequisites

-   Node.js (v18 or higher)
-   npm (or yarn/pnpm)
-   A free MongoDB Atlas account for the database.
-   A free Clerk.dev account for authentication.
-   A free Cloudinary account for media storage.

#### Installation & Setup

1.  **Fork & Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/beatBuddies.git](https://github.com/YOUR_USERNAME/beatBuddies.git)
    cd beatBuddies
    ```

2.  **Set up Backend Environment Variables:**
    -   Navigate to the `backend` folder: `cd backend`
    -   Create a `.env` file by copying the `.env.sample`.
    -   Fill in the following variables:

    | Variable                | Description                                                |
    | :---------------------- | :--------------------------------------------------------- |
    | `PORT`                  | The port for the backend server (e.g., `8000`).            |
    | `MONGODB_URI`           | Your connection string from MongoDB Atlas.                 |
    | `ADMIN_EMAIL`           | The email address that will have admin privileges.         |
    | `CLOUDINARY_API_KEY`    | Your API Key from Cloudinary.                              |
    | `CLOUDINARY_API_SECRET` | Your API Secret from Cloudinary.                           |
    | `CLOUDINARY_CLOUD_NAME` | Your Cloud Name from Cloudinary.                           |
    | `CLERK_PUBLISHABLE_KEY` | Your Publishable Key from Clerk.dev.                       |
    | `CLERK_SECRET_KEY`      | Your Secret Key from Clerk.dev.                            |

3.  **Set up Frontend Environment Variables:**
    -   Navigate to the `frontend` folder: `cd ../frontend`
    -   Create a `.env` file by copying the `.env.sample`.
    -   Fill in the following variables:

    | Variable                  | Description                                            |
    | :------------------------ | :----------------------------------------------------- |
    | `VITE_CLERK_PUBLISHABLE_KEY` | Your **same** Publishable Key from Clerk.dev.        |
    | `VITE_API_URL`              | The full URL to your backend API (e.g., `http://localhost:8000/api`). |


4.  **Install Dependencies for both frontend and backend:**
    -   From the **root** of the project, run:
    ```bash
    npm install
    npm run build
    ```
    This command will automatically install dependencies for both the `frontend` and `backend` directories.


5.  **Seed the Database:**
    -   Your database is currently empty. Navigate to the `backend` folder and run the seed scripts to populate it with sample data:
    ```bash
    cd ../backend
    npm run seed:songs
    npm run seed:albums
    ```

6.  **Run the Application:**
    -   You will need two separate terminals.
    -   **In Terminal 1 (for the backend):**
        ```bash
        cd backend
        npm run dev
        ```
    -   **In Terminal 2 (for the frontend):**
        ```bash
        cd frontend
        npm run dev
        ```

Your application should now be running locally! The frontend will typically be on `http://localhost:5173`.

---

### ☁️ Deployment

This application is configured to be easily deployed on a service like **Render**.

1.  Push your code to your forked GitHub repository.
2.  On Render, create a new **Web Service**.
3.  Connect your GitHub repository.
4.  Set the **Root Directory** to `backend`.
5.  Set the **Build Command** to `npm install`.
6.  Set the **Start Command** to `npm start`.
7.  Add all of your backend environment variables to the Render dashboard.
8.  Deploy! Repeat the process for the frontend as a **Static Site**.

---

### 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.