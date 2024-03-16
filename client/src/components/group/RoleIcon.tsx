import {ShieldAlert, ShieldCheck, ShieldPlus} from "lucide-react";
import React from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";



const RoleIcon: React.FC<{role: string}> = ({role}) => {
    const getIcon = () => {
        switch(role) {
            case "author": return <ShieldPlus className="icon"/>
            case "admin": return <ShieldAlert className="icon"/>;
            case "mod": return <ShieldCheck className="icon"/>;
            default: return null;
        }
    }

    const getText = () => {
        switch(role) {
            case "author": return "Admin-Author";
            case "admin": return "Admin";
            case "mod": return "Moderator";
            default: return "";
        }
    }

    return(
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    {getIcon()}
                </TooltipTrigger>
                <TooltipContent>
                    {getText()}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default RoleIcon;