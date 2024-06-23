import {fileUrl} from "@/functions/fileUrl";
import { File } from "lucide-react";
import { Card, CardContent } from "./ui/card";



const FileDownload: React.FC<{url: string}> = ({url}) => {
    const name = url.split("-")[1];

    return(
        <a
            className="hover:underline"
            href={fileUrl(url)} 
            target="_blank"
            download
        >
            <Card>
                <CardContent className="flex gap-2 items-center p-2">
                    <File className="icon"/>
                    {name}
                </CardContent>
            </Card>
        </a>
    );
}

export default FileDownload;