import { Router } from "express";
import { authCallback, createUserManually } from "../controller/auth.controller.js";

const router = Router();

router.post("/callback", authCallback);
router.post("/create-user", createUserManually); // No auth required for testing

export default router;
