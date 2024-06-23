import React from "react";
import {Link} from "react-router-dom";
import {Card, CardContent, CardFooter} from "@/components/ui/card.tsx";
import GroupTypeInfo from "@/components/group/GroupTypeInfo.tsx";
import {Group} from "@/types";
import {fileUrl} from "@/functions/fileUrl";



const GroupCard: React.FC<{group: Group}> = ({group}) => {
    return(
        <Link
            to={`/groups/${group._id}`}
            className="max-w-[400px] w-full"
        >
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="image-optional">
                        <img
                            className="bg-gray-700 aspect-[12/4] w-full object-cover"
                            src={group.backgroundImage && fileUrl(group.backgroundImage)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <span>
                        {group.name}
                    </span>
                    <div className="flex gap-3">
                        <span>
                            {group.members} Members
                        </span>
                        <GroupTypeInfo group={group}/>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}

export default GroupCard;