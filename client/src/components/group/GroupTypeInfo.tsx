import {EyeOff, Globe, Lock} from "lucide-react";
import React from "react";
import {Group} from "@/types";



const GroupTypeInfo: React.FC<{group: Group}> = ({group}) => {
    return (
        <div className="flex items-center">
            {group.hidden ? (
                <>
                    <EyeOff className="mr-1 h-4 w-4"/> Hidden
                </>
            ) : group.private ? (
                <>
                    <Lock className="mr-1 h-4 w-4"/> Private
                </>
            ) : (
                <>
                    <Globe className="mr-1 h-4 w-4"/> Public
                </>
            )}
        </div>
    );
}

export default GroupTypeInfo;