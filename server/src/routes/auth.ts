import * as auth from "../controllers/auth";
import express from "express";
import {catchAsync} from "../errors";



const router = express.Router();

router.post("/register", catchAsync(auth.register));
router.post("/log-in", catchAsync(auth.logIn));
router.post("/log-out", catchAsync(auth.logOut));

export default router;