import React from "react";
import {Link} from "react-router-dom";
import {ChevronDown, Settings, UserCheck, UserMinus, UserPlus} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button.tsx";
import store from "@/store";
import {groupsActions} from "@/store/slices/groupsSlice.ts";
import {Group} from "@/types";



const GroupButton: React.FC<{group: Group}> = ({group}) => {
    const handleJoin = () => store.dispatch(groupsActions.join(group._id));

    if(["admin", "author"].includes(group.myRole as string)) return(
        <>
            <Button asChild>
                <Link to="admin">
                    <Settings className="mr-2 h-4 w-4"/>
                    Settings
                </Link>
            </Button>
            {group.myRole !== "author" ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>
                            <UserCheck className="mr-2 w-4 h-4"/>
                            Member
                            <ChevronDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={handleJoin}
                            className="!text-destructive"
                        >
                            <UserMinus className="mr-2 w-4 h-4"/>
                            Leave group
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : null}
        </>
    );
    else if(group.requested) return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <UserCheck className="mr-2 w-4 h-4"/>
                    Requested
                    <ChevronDown className="ml-2 h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleJoin}>
                    <UserMinus className="mr-2 w-4 h-4"/>
                    Cancel request
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    else if(group.joined) return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <UserCheck className="mr-2 w-4 h-4"/>
                    Member
                    <ChevronDown className="ml-2 h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem
                    onClick={handleJoin}
                    className="!text-destructive"
                >
                    <UserMinus className="mr-2 w-4 h-4"/>
                    Leave group
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    else return(
        <Button onClick={handleJoin}>
            <UserPlus className="mr-2 w-4 h-4"/>
            Join
        </Button>
    );
}

export default GroupButton;