import React, {useState} from "react";
import {Plus} from "lucide-react";
import {Button} from "../ui/button";
import {
    Dialog, DialogClose, DialogContent,
    DialogFooter, DialogHeader, DialogTrigger
} from "../ui/dialog";
import {Label} from "../ui/label";
import {Input} from "../ui/input";
import {RadioGroup, RadioGroupItem} from "../ui/radio-group";
import store from "@/store";
import {addGroup} from "@/store/slices/groupsSlice.ts";



const GroupForm: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [option, setOption] = useState<string>("public");

    const handleConfirm = () => {
        let visibility = option == "hidden" ? "hidden" : "visible";
        let privacy = option == "public" ? "public" : "private";

        store.dispatch(addGroup({name, privacy, visibility}));
    }

    const handleReset = () => {
        setName("");
        setOption("public");
    }

    return(
        <Dialog onOpenChange={handleReset}>
            <DialogTrigger>
                <Button>
                    <Plus className="mr-2 h-4 w-4"/>
                    Create group
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    Create group
                </DialogHeader>
                <div className="flex flex-col gap-10 px-1">
                    <div>
                        <Label>
                            Name
                        </Label>
                        <Input
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <RadioGroup value={option} onValueChange={(value) => setOption(value)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="public" id="r1" />
                                <Label htmlFor="r1" className="cursor-pointer">
                                    Public
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="private" id="r2" />
                                <Label htmlFor="r2" className="cursor-pointer">
                                    Private
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hidden" id="r3" />
                                <Label htmlFor="r3" className="cursor-pointer">
                                    Hidden
                                </Label>
                            </div>
                        </RadioGroup>
                        <div className="flex flex-col gap-1 text-sm">
                            <span>
                                <b>Public</b> - Anyone can who is in the group and what they post.
                            </span>
                            <span>
                                <b>Private</b> - Anyone can find this group, but only members can see who is in the group and what they post.
                            </span>
                            <span>
                                <b>Hidden</b> - Only members can find this group, to join you have to get invitation link.
                            </span>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose>
                        <Button variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose>
                        <Button onClick={handleConfirm} disabled={!name}>
                            Confirm
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default GroupForm;