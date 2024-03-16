import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronDown, UserCheck, UserMinus, UserPlus} from "lucide-react";
import {useSelector} from "react-redux";
import React from "react";
import store from "@/store";
import {usersActions} from "@/store/slices/usersSlice.ts";
import {User} from "@/types";



const ProfileButton: React.FC<{profile: User}> = ({profile}) => {
    const user = useSelector((state: any) => state.auth.user);

    const handleFollow = () => store.dispatch(usersActions.follow({id: profile._id, myId: user._id}));

    const handleAccept = () => store.dispatch(usersActions.acceptFollow({id: profile._id, isAccepted: true}));
    const handleCancel = () => store.dispatch(usersActions.acceptFollow({id: profile._id, isAccepted: false}));

    if(profile.isFollowed) return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <UserCheck className="mr-2 h-4 w-4"/>
                    Following
                    <ChevronDown className="ml-2 h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleFollow}>
                    <UserMinus className="mr-2 h-4 w-4"/>
                    Unfollow
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
    else if(profile.isRequested) return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <UserCheck className="mr-2 h-4 w-4"/>
                    Requested
                    <ChevronDown className="ml-2 h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleFollow}>
                    <UserMinus className="mr-2 h-4 w-4"/>
                    Cancel request
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
    else if(profile.requestedMe) return(
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
    );
    else if(profile._id != user?._id) return(
        <Button onClick={handleFollow}>
            <UserPlus className="mr-2 h-4 w-4"/>
            Follow
        </Button>
    );
}

export default ProfileButton;