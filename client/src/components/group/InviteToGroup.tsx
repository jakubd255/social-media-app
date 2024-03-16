import React from "react";
import {Send, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {
    Dialog, DialogClose, DialogContent,
    DialogFooter, DialogHeader, DialogTrigger
} from "@/components/ui/dialog.tsx";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import store from "@/store";
import {generateLink, groupsActions} from "@/store/slices/groupsSlice.ts";
import {Group} from "@/types";



const InviteToGroup: React.FC<{group: Group}> = ({group}) => {
    const location = `${window.location.protocol}//${window.location.hostname}`;

    const generate = (days: number | null) => {
        store.dispatch(generateLink({days: days, id: group._id}));
    }

    const remove = (id: string) => {
        store.dispatch(groupsActions.removeLink(id));
    }

    return(
        <Dialog>
            <DialogTrigger>
                <Button variant="outline">
                    <Send className="mr-2 h-4 w-4"/>
                    Invite
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    Invite to group
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    {group.links?.map((link: any) =>
                        <div className="flex justify-between">
                            <span>
                                {location}/groups/join/{link._id}
                            </span>
                            <div className="flex gap-1">
                                <Button 
                                    size="icon" 
                                    variant="outline"
                                    onClick={() => remove(link._id)}
                                >
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button>
                                Generate new
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>
                                Expiration time
                            </DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => generate(1)}>
                                1 day
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => generate(17)}>
                                1 week
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => generate(30)}>
                                30 days
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => generate(null)}>
                                Never
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogClose>
                        <Button variant="outline">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default InviteToGroup