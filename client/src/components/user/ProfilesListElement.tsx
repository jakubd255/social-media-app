import initials from "@/functions/initials";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import {Button} from "../ui/button";
import {Link} from "react-router-dom";
import GroupMemberDropdown from "@/components/user/GroupMemberDropdown.tsx";
import React from "react";
import {User} from "@/types";
import ProfileButton from "./ProfileButton.tsx";
import {UserCheck, UserMinus} from "lucide-react";
import store from "@/store";
import {usersActions} from "@/store/slices/usersSlice.ts";
import {useSelector} from "react-redux";
import RoleIcon from "@/components/group/RoleIcon.tsx";
import imageUrl from "@/functions/imageUrl.ts";



interface ProfilesListElementProps {
    profile: User;
    showGroupAccept?: boolean;
    showGroupDropdown?: boolean;
    showFollow?: boolean;
}

const ProfilesListElement: React.FC<ProfilesListElementProps> = ({profile, showGroupAccept=false, showGroupDropdown=false, showFollow=false}) => {
    const group = useSelector((state: any) => state.groups.chosen);

    const handleAccept = () => store.dispatch(usersActions.acceptToGroup({id: profile._id, groupId: group._id, isAccepted: true}));
    const handleCancel = () => store.dispatch(usersActions.acceptToGroup({id: profile._id, groupId: group._id, isAccepted: false}));

    return(
        <div className="flex justify-between h-max max-w-[600px] w-full">
            <div className="flex gap-2">
                <Avatar>
                    <AvatarImage 
                        src={profile.profileImage && imageUrl(profile.profileImage)} 
                        draggable={false}
                    />
                    <AvatarFallback>
                        {initials(profile.fullname)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                        <Button 
                            variant="link" 
                            className="p-0 w-min h-min !font-sans !text-base text-black dark:text-white" 
                            asChild
                        >
                            <Link to={`/profile/${profile._id}`}>
                                {profile.fullname}
                            </Link>
                        </Button>
                        {profile.role ? (
                            <RoleIcon role={profile.role}/>
                        ) : null}
                    </div>
                    <span>
                        @{profile.username}
                    </span>
                </div>
            </div>
            <div className="gap-2 flex w-[200px] justify-end items-center">
                {showFollow ? (
                    <ProfileButton profile={profile}/>
                ) : showGroupAccept ? (
                    <div className="flex gap-2">
                        <Button onClick={handleAccept}>
                            <UserCheck className="mr-2 h-4 w-4"/>
                            Accept
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                            <UserMinus className="mr-2 h-4 w-4"/>
                            Cancel
                        </Button>
                    </div>
                ) : null}
                {showGroupDropdown ? (
                    <GroupMemberDropdown user={profile}/>
                ) : null}
            </div>
        </div>
    );
}

export default ProfilesListElement;