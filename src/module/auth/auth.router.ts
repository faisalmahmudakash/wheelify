import express from "express";
import { authController } from "./auth.controller";

const router = express.Router();

router.post("/signup",  authController.creatUser);
router.post("/signin", authController.login);


export const authRouter = router;