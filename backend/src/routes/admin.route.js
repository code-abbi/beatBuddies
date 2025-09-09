import { Router } from "express";
import { checkAdmin, createAlbum, createAlbumFromUrl, createSong, createSongFromUrl, deleteAlbum, deleteSong } from "../controller/admin.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute, requireAdmin);

router.get("/check", checkAdmin);

router.post("/songs", createSong);
router.post("/songs/url", createSongFromUrl);
router.delete("/songs/:id", deleteSong);

router.post("/albums", createAlbum);
router.post("/albums/url", createAlbumFromUrl);
router.delete("/albums/:id", deleteAlbum);

export default router;
