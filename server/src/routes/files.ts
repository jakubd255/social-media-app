import * as files from "../controllers/files";
import express from "express";



const router = express.Router();

router.get("/video/:file", files.streamVideo);
router.get("/:file", files.getFile);

export default router;