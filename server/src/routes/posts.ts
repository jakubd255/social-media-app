import * as posts from "../controllers/posts";
import express from "express";
import authenticate from "../middlewares/authenticate";
import {catchAsync} from "../errors";
import upload from "../middlewares/upload";
import authorizeAdmin from "../middlewares/authorizeAdmin";



const router = express.Router();

router.post("/", upload.array("files", 5), authenticate, catchAsync(posts.add));

router.get("/explore/:input?", authenticate, catchAsync(posts.explore));
router.get("/admin/:input?", authenticate, authorizeAdmin, catchAsync(posts.adminGet));

router.get("/:id/voters/:index", authenticate, catchAsync(posts.getVoters));

router.get("/:choice?/:id?", authenticate, catchAsync(posts.get));

router.put("/like/:id", authenticate, catchAsync(posts.like));
router.put("/save/:id", authenticate, catchAsync(posts.save));
router.put("/vote/:id/add", authenticate, catchAsync(posts.addVoteOption));
router.put("/vote/:id", authenticate, catchAsync(posts.vote));

router.delete("/:id", authenticate, catchAsync(posts.remove));

export default router;