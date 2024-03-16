import React from "react";
import {Skeleton} from "@/components/ui/skeleton.tsx";



const ProfileLoadingPage: React.FC = () => {
    return(
        <div className="flex flex-1 justify-center pb-5 px-2">
            <div>
                <div className="relative">
                    <Skeleton className="w-full image-wrapper border border-t-0 rounded-lg rounded-t-none">
                        <img className="aspect-[12/4] w-[1200px] block rounded-none border-0"/>
                    </Skeleton>
                    <Skeleton className="w-[200px] h-[100px] rounded-t-none rounded-bl-[100px] rounded-br-[100px] absolute bottom-0 left-5 translate-y-[100%] border-0"/>
                </div>
                <div className="flex justify-end py-4">
                    <Skeleton className="w-[140px] h-[40px]"/>
                </div>
                <div className="mt-[50px] flex flex-col items-start gap-6">
                    <div className="flex flex-col items-start gap-2.5">
                        <div className="flex flex-col">
                            <Skeleton className="w-[240px] h-[40px]"/>
                            <div className="flex gap-2.5 items-center">
                                <Skeleton className="w-[140px] h-[28px]"/>
                            </div>
                        </div>
                        <Skeleton className="w-[800px] h-[24px]"/>
                        <div className="flex gap-5">
                            <Skeleton className="w-[80px] h-[24px]"/>
                            <Skeleton className="w-[90px] h-[24px]"/>
                        </div>
                    </div>
                    <Skeleton className="w-[275px] h-[40px]"/>
                </div>
            </div>
        </div>
    );
}

export default ProfileLoadingPage;