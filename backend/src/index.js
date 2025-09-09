import express from "express";
import dotenv from "dotenv";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import { initializeSocket } from "./lib/socket.js";
import { createServer } from "http";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import statRoutes from "./routes/stat.route.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	})
);
app.use(ClerkExpressWithAuth());

initializeSocket(httpServer);

app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stats", statRoutes);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

httpServer.listen(process.env.PORT, () => {
	connectDB();
	console.log(`Server is running on port ${process.env.PORT}`);
});