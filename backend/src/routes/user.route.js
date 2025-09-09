import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getMessages, debugUsers, updateUser, deleteUser } from "../controller/user.controller.js";
const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);
router.put("/:id", updateUser); // No auth required for testing
router.delete("/:id", deleteUser); // No auth required for testing
router.get("/debug", debugUsers); // No auth required for debugging

export default router;
