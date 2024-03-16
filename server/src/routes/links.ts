import express from "express";
import * as links from "../controllers/links";
import {catchAsync} from "../errors";
import authenticate from "../middlewares/authenticate";



const router = express.Router();

router.post("/", authenticate, catchAsync(links.add));
router.get("/:groupId", authenticate, catchAsync(links.getAll));
router.delete("/:id", authenticate, catchAsync(links.remove));

export default router;