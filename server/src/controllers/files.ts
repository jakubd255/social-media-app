import {Request, Response} from "express";
import fs from "fs";
import path from "path";



export const streamVideo = (req: Request, res: Response) => {
    const {file} = req.params;

    const videoPath = path.resolve(__dirname, "../../uploads/"+file);
    const videoStat = fs.statSync(videoPath);
    const fileSize = videoStat.size;
    const range = req.headers.range;

    if(range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4",
        };

        res.writeHead(206, head);
        file.pipe(res);
    } 
    else {
        const head = {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4",
        };

        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
}



export const getFile = (req: Request, res: Response) => {
    const {file} = req.params;

    const filePath = path.join(__dirname, "../../uploads/"+file);

    res.download(filePath, file, (err) => {
        if(err) {
            res.status(404).send("File not found");
        }
    });
}