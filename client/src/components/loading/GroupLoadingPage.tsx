import React from "react";
import {Skeleton} from "@/components/ui/skeleton.tsx";



const GroupLoadingPage: React.FC = () => {
    return(
        <div className="flex flex-1 justify-center pb-5 px-2">
            <div>
                <div className="relative">
                    <Skeleton className="w-full image-wrapper border border-t-0 rounded-lg rounded-t-none">
                        <img className="aspect-[12/4] w-[1200px] rounded-none"/>
                    </Skeleton>
                </div>
                <div className="flex flex-col gap-2 py-2">
                    <div className="flex justify-between w-full">
                        <Skeleton className="w-[300px] h-[40px]"/>
                        <div className="flex gap-2 items-center">
                            <Skeleton className="w-[117px] h-[40px]"/>
                            <Skeleton className="w-[137px] h-[40px]"/>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <Skeleton className="w-[65px] h-[24px]"/>
                        <Skeleton className="w-[80px] h-[24px]"/>
                    </div>
                </div>
                <Skeleton className="w-[420px] h-[40px]"/>
            </div>
        </div>
    );
}

export default GroupLoadingPage;