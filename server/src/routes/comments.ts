import express from "express";
import * as comments from "../controllers/comments";
import {catchAsync} from "../errors";
import authenticate from "../middlewares/authenticate";
import authorizeAdmin from "../middlewares/authorizeAdmin";



const router = express.Router();

router.post("/", authenticate, catchAsync(comments.add));

router.get("/admin/:input?", authenticate, authorizeAdmin, catchAsync(comments.adminGet));
router.get("/:postId", authenticate, catchAsync(comments.get));

router.delete("/:id", authenticate, catchAsync(comments.remove));

export default router;