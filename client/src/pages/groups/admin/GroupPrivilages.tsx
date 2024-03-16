import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {useNavigate, useOutletContext} from "react-router-dom";
import {
    Dialog, DialogClose, DialogContent,
    DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {groupsActions, updateGroup} from "@/store/slices/groupsSlice.ts";
import store from "@/store";
import {Group, Privilage} from "@/types";



const GroupPrivilages: React.FC = () => {
    const {group}: {group: Group} = useOutletContext<any>();

    const navigate = useNavigate();

    const [posting, setPosting] = useState<Privilage>("all");
    const [approving, setApproving] = useState<Privilage>("all");

    useEffect(() => {
        setPosting(group?.privilages?.posting as Privilage);
        setApproving(group?.privilages?.approving as Privilage);
    }, [group]);

    const handleConfirm = () => {
        store.dispatch(updateGroup({
            id: group?._id,
            form: {
                privilages: {
                    posting: posting,
                    approving: approving
                }
            }
        }));
    }

    const handleDelete = () => {
        store.dispatch(groupsActions.remove());
        navigate("/");
    }

    if(group?._id && posting && approving) return(
        <div className="flex flex-col gap-10 px-10 w-full">
            <div>
                <h2 className="text-2xl text-left">
                    Who can post?
                </h2>
                <RadioGroup 
                    value={posting} 
                    onValueChange={(value: Privilage) => setPosting(value)}
                >
                    <div className="flex gap-2">
                        <RadioGroupItem value="admin" id="r1"/>
                        <Label htmlFor="r1">
                            Only admins
                        </Label>
                    </div>
                    <div className="flex gap-2">
                        <RadioGroupItem value="mod" id="r2"/>
                        <Label htmlFor="r2">
                            Admins and moderators
                        </Label>
                    </div>
                    <div className="flex gap-2">
                        <RadioGroupItem value="all" id="r3"/>
                        <Label htmlFor="r3">
                            Anyone in the group
                        </Label>
                    </div>
                </RadioGroup>
            </div>
            {group.private ? (
                <div>
                    <h2 className="text-2xl text-left">
                        Who can approve members?
                    </h2>
                    <RadioGroup 
                        value={approving} 
                        onValueChange={(value: Privilage) => setApproving(value)}
                    >
                        <div className="flex gap-2">
                            <RadioGroupItem value="admin" id="r4"/>
                            <Label htmlFor="r4">
                                Only admins
                            </Label>
                        </div>
                        <div className="flex gap-2">
                            <RadioGroupItem value="mod" id="r5"/>
                            <Label htmlFor="r5">
                                Admins and moderators
                            </Label>
                        </div>
                        <div className="flex gap-2">
                            <RadioGroupItem value="all" id="r6"/>
                            <Label htmlFor="r6">
                                Anyone in the group
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            ) : null}
            {(group?.privilages?.posting !== posting || group?.privilages?.approving !== approving) ? (
                <div className="flex gap-2">
                    <Button onClick={handleConfirm}>
                        Update
                    </Button>
                </div>
            ) : null}
            {group.myRole === "author" ? (
                <div className="flex flex-col gap-2 items-start">
                    <h2 className="text-2xl text-destructive">
                        Delete group
                    </h2>
                    <Dialog>
                        <DialogTrigger>
                            <Button variant="destructive">
                                Delete group
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Are you sure to delete this group?
                                </DialogTitle>
                                <DialogDescription>
                                    When you delete this group, you and all members will loose all posts permanently.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose>
                                    <Button variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button variant="destructive" onClick={handleDelete}>
                                    Confirm
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            ) : null}
        </div>
    );
}

export default GroupPrivilages;