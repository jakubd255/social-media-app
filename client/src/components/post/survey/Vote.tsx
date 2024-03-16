import React from "react";
import fixNumber from "@/functions/fixNumber.ts";
import {Button} from "@/components/ui/button.tsx";
import {RadioGroupItem} from "@/components/ui/radio-group.tsx";



interface VoteProps {
    children: any;
    id: string;
    percentage: number;
    index: number;
}

const Vote: React.FC<VoteProps> = ({children, id, percentage, index}) => {
    return(
        <Button asChild variant="outline" className="overflow-hidden flex-1">
            <label className="relative cursor-pointer flex !justify-between" htmlFor={id}>
                <div className="flex gap-2 items-center">
                    <RadioGroupItem value={index.toString()} id={id}/>
                    {children}
                </div>
                <div>
                    {percentage ? fixNumber(percentage)+"%" : null}
                </div>
                <div 
                    className={`absolute bg-[hsl(var(--primary))] opacity-10 h-[100%] left-0`} 
                    style={{width: `${percentage || 0}%`}}
                >
                </div>
            </label>
        </Button>
    );
}

export default Vote;