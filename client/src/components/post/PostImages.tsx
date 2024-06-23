import React from "react";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area.tsx";
import checkFileType from "@/functions/checkFileType";
import {videoUrl, fileUrl} from "@/functions/fileUrl";



const PostImages: React.FC<{images: string[]}> = ({images}) => {
    if(images?.length) return (
        <ScrollArea>
            <div className="flex gap-3 px-3 pb-3 w-max items-center">
                {images.map((image: string, index: number) =>
                    <div>
                        {checkFileType(image) === "image" ? (
                            <img
                                className="max-w-[calc(600px-24px-2px)] max-h-[500px] object-contain rounded-lg border"
                                src={image.includes("http") ? image : fileUrl(image)}
                                draggable={false}
                                alt={`Image ${index.toString()}`}
                            />
                        ) : checkFileType(image) === "video" ? (
                            <video 
                                className="max-w-[calc(600px-24px-2px)] max-h-[500px] object-contain rounded-lg border"
                                src={videoUrl(image)} controls
                            />
                        ) : null}
                    </div>
                )}
            </div>
            <ScrollBar orientation="horizontal"/>
        </ScrollArea>
    );
}

export default PostImages;