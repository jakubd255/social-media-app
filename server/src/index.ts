import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import auth from "./routes/auth";
import users from "./routes/users";
import posts from "./routes/posts";
import groups from "./routes/groups";
import links from "./routes/links";
import comments from "./routes/comments";
import files from "./routes/files";
import createAdmin from "./admin";

dotenv.config();
const server: Express = express();

server.use(express.json());
server.use(cors({origin: "http://localhost:5173", credentials: true}));
server.use(cookieParser());

server.use("/auth", auth);
server.use("/users", users);
server.use("/posts", posts);
server.use("/groups", groups);
server.use("/links", links);
server.use("/comments", comments);
server.use("/files", files);
//server.use("/uploads", express.static("uploads"));


server.get("/",  (req: Request, res: Response) => {
    return res.status(200).send("Hello World!");
});

mongoose.connect(process.env.MONGO_URI || "").then(() => {
    console.log("Database connected");
    createAdmin();
});

const port = process.env.PORT || 8000;
server.listen(port, async () => {
    console.log(`Server runs on port ${port}`);
});

export default server