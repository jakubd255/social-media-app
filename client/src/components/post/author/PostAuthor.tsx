import React from "react";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import RoleIcon from "@/components/group/RoleIcon.tsx";
import {User} from "@/types";
import Avatar from "@/components/Avatar";



const PostAuthor: React.FC<{user: User}> = ({user}) => {
    return(
        <div className="flex gap-2">
            <Avatar
                name={user.fullname}
                image={user.profileImage}
            />
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