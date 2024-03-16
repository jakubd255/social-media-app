import * as users from "../controllers/users";
import express from "express";
import authenticate from "../middlewares/authenticate";
import {catchAsync} from "../errors";
import upload from "../middlewares/upload";
import authorizeAdmin from "../middlewares/authorizeAdmin";



const router = express.Router();

router.get("/search/:input?", catchAsync(users.search));
router.get("/admin/:input?", authenticate, authorizeAdmin, catchAsync(users.adminGet));
router.get("/explore/:input?", authenticate, catchAsync(users.explore));

router.get("/:id?", authenticate, catchAsync(users.getUser));
router.get("/:id/:option", authenticate, catchAsync(users.getFollowUsers));

router.put("/", upload.fields([{name: "profileImage", maxCount: 1}, {name: "backgroundImage", maxCount: 1}]), authenticate, catchAsync(users.edit));
router.put("/email-username", authenticate, catchAsync(users.updateEmail));
router.put("/password", authenticate, catchAsync(users.updatePassword));
router.put("/:id/follow", authenticate, catchAsync(users.follow));
router.put("/:id/accept", authenticate, catchAsync(users.accept));

router.delete("/:id", authenticate, catchAsync(users.remove));

export default router;