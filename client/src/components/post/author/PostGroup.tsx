import React from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import initials from "@/functions/initials.ts";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import RoleIcon from "@/components/group/RoleIcon.tsx";
import {Group, User} from "@/types";
import imageUrl from "@/functions/imageUrl";



interface PostGroupProps {
    user: User;
    group: Group;
}

const PostGroup: React.FC<PostGroupProps> = ({user, group}) => {
    return(
        <div className="flex gap-5">
            <div className="relative">
                <Avatar className="!rounded-sm">
                    <AvatarImage 
                        src={group.backgroundImage && imageUrl(group.backgroundImage)} 
                        draggable={false}
                    />
                    <AvatarFallback>
                        {initials(group.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute top-2 left-2">
                    <Avatar>
                        <AvatarImage 
                            src={user.profileImage && imageUrl(user.profileImage)} 
                            draggable={false}
                        />
                        <AvatarFallback>
                            {initials(user.fullname)}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex gap-2 items-center">
                    <Button
                        variant="link"
                        className="p-0 w-min h-min !font-sans !text-base text-black dark:text-white"
                        asChild
                    >
                        <Link to={`/groups/${group._id}`}>
                            {group.name}
                        </Link>
                    </Button>
                </div>
                <div className="flex gap-1 items-center">
                    <Button
                        variant="link"
                        className="p-0 w-min h-min !font-sans !text-base text-black dark:text-white"
                        asChild
                    >
                        <Link to={`/profile/${user._id}`}>
                            {user.fullname}
                        </Link>
                    </Button>
                    {user.role ? (
                        <RoleIcon role={user.role}/>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default PostGroup;