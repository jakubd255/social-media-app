import React from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import initials from "@/functions/initials.ts";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import RoleIcon from "@/components/group/RoleIcon.tsx";
import {User} from "@/types";
import imageUrl from "@/functions/imageUrl";



const PostAuthor: React.FC<{user: User}> = ({user}) => {
    return(
        <div className="flex gap-2">
            <Avatar>
                <AvatarImage 
                    src={user.profileImage && imageUrl(user.profileImage)} 
                    draggable={false}
                />
                <AvatarFallback>
                    {initials(user.fullname)}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
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
                <span>
                    @{user.username}
                </span>
            </div>
        </div>
    );
}

export default PostAuthor;