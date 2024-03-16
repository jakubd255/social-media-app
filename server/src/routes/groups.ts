import express from "express";
import * as groups from "../controllers/groups";
import {catchAsync} from "../errors";
import authenticate from "../middlewares/authenticate";
import upload from "../middlewares/upload";
import authorizeAdmin from "../middlewares/authorizeAdmin";



const router = express.Router();

router.post("/", authenticate, catchAsync(groups.add));

router.get("/", authenticate, catchAsync(groups.getAll));
router.get("/admin/:input?", authenticate, authorizeAdmin, catchAsync(groups.adminGet));
router.get("/explore/:input?", authenticate, catchAsync(groups.explore));
router.get("/search/:input?", authenticate, catchAsync(groups.search));
router.get("/:id", authenticate, catchAsync(groups.getOne));
router.get("/:id/requests", authenticate, catchAsync(groups.getRequests));
router.get("/:id/members", authenticate, catchAsync(groups.getMembers));

router.put("/join/:id", authenticate, catchAsync(groups.join));
router.put("/join-to-hidden/:linkId", authenticate, catchAsync(groups.joinToHidden));
router.put("/:id", upload.fields([{name: "backgroundImage", maxCount: 1}]), authenticate, catchAsync(groups.edit));

router.put("/:groupId/:userId/accept", authenticate, catchAsync(groups.accept));
router.put("/:groupId/:userId/change-role", authenticate, catchAsync(groups.changeRole))
router.put("/:groupId/:userId/remove", authenticate, catchAsync(groups.removeMember));

router.delete("/:id", authenticate, catchAsync(groups.remove));

export default router;