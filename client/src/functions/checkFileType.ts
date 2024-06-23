import { FileType } from "@/types";

const checkFileType = (fileName: string): FileType => {
    const fileParts = fileName.split(".");

    const fileExtension = fileParts[fileParts.length-1];

    if(["png", "jpg", "jpeg", "webp", "gif"].includes(fileExtension.toLocaleLowerCase())) 
        return "image";
    else if(["mp4", "mov"].includes(fileExtension.toLocaleLowerCase())) 
        return "video";
    else 
        return "file";
}

export default checkFileType;