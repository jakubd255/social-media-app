import React from "react";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import RoleIcon from "@/components/group/RoleIcon.tsx";
import {Group, User} from "@/types";
import Avatar from "@/components/Avatar";



interface PostGroupProps {
    user: User;
    group: Group;
}

const PostGroup: React.FC<PostGroupProps> = ({user, group}) => {
    return(
        <div className="flex gap-5">
            <div className="relative">
                <Avatar
                    className="!rounded-sm"
                    name={group.name}
                    image={group.backgroundImage}
                />
                <div className="absolute top-2 left-2">
                    <Avatar
                        name={user.fullname}
                        image={user.profileImage}
                    />
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