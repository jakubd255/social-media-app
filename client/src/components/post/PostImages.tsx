import React from "react";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area.tsx";
import imageUrl from "@/functions/imageUrl";



const PostImages: React.FC<{images: string[]}> = ({images}) => {
    return (
        <ScrollArea>
            <div className="flex gap-3 px-3 pb-3 w-max items-center">
                {images.map((image: string, index: number) =>
                    <div>
                        <img
                            className="max-w-[calc(600px-24px-2px)] max-h-[500px] object-contain rounded-lg border"
                            src={image.includes("http") ? image : imageUrl(image)}
                            draggable={false}
                            alt={`Image ${index.toString()}`}
                        />
                    </div>
                )}
            </div>
            <ScrollBar orientation="horizontal"/>
        </ScrollArea>
    );
}

export default PostImages;