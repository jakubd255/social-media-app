import { FileType } from "@/types";

const checkFileType = (fileName: string): FileType => {
    const fileParts = fileName.split(".");

    const fileExtension = fileParts[fileParts.length-1];

    if(["png", "jpg", "jpeg", "webp"].includes(fileExtension.toLocaleLowerCase())) 
        return "image";
    else if(["mp4"].includes(fileExtension)) 
        return "video";
    else return "file";
}

export default checkFileType;