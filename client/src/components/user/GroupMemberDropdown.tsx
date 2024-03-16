import {MoreHorizontal, Trash2, ShieldQuestion, ShieldAlert, ShieldCheck, ShieldOff} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {Button} from "../ui/button";
import React from "react";
import {useSelector} from "react-redux";
import store from "@/store";
import {usersActions} from "@/store/slices/usersSlice.ts";
import {User} from "@/types";



const GroupMemberDropdown: React.FC<{user: User}> = ({user}) => {
    const group = useSelector((state: any) => state.groups.chosen);

    const handleSetRole = (value: string) => {
        const newRole = value != "default" ? value : null;

        store.dispatch(usersActions.setRole({id: user._id, groupId: group._id, role: newRole}));
    }

    const handleRemoveFromGroup = () => {
        store.dispatch(usersActions.removeFromGroup({id: user._id, groupId: group._id}));
    }

    if((["author", "admin"].includes(group?.myRole) && user.role !== "author")) return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                >
                    <MoreHorizontal className="w-4 h-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    className="!text-destructive"
                    onClick={handleRemoveFromGroup}
                >
                    <Trash2 className="mr-2 w-4 h-4"/>
                    Remove from group
                </DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <ShieldQuestion className="mr-2 w-4 h-4"/>
                        Set role
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup 
                            value={user.role || "default"}
                            onValueChange={handleSetRole}
                        >
                            <DropdownMenuRadioItem value="admin">
                                <ShieldAlert className="mr-2 w-4 h-4"/>
                                Admin
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="mod">
                                <ShieldCheck className="mr-2 w-4 h-4"/>
                                Moderator
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="default">
                                <ShieldOff className="mr-2 w-4 h-4"/>
                                Default
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    );
    else return (
        <div className="w-8 h-8"></div>
    );
}

export default GroupMemberDropdown;