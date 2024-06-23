import fs from "fs";
import path from "path";



const deleteFile = (file: string) => {
    const fullPath = path.join(__dirname, "/../../../uploads/", file);

    fs.unlink(fullPath, (err) => {
        if(err) {
            console.error(`Error deleting file ${file}:`, err);
        }
        else {
            console.log(`File ${file} deleted successfully`);
        }
    });
}

export default deleteFile;