import React from "react";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {
    Dialog, DialogClose, DialogContent,
    DialogFooter, DialogHeader, DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useSelector} from "react-redux";
import store from "@/store";
import {authActions} from "@/store/slices/authSlice.ts";



const Privacy: React.FC = () => {
    document.title = "Privacy settings - SocialApp";
    
    const user = useSelector((state: any) => state.auth.user);

    const handleTogglePrivacy = () => store.dispatch(authActions.togglePrivate());

    return(
        <div className="flex flex-col gap-[60px] px-10">
            <div className="flex flex-col gap-[20px]">
                <h2 className="text-2xl text-left">
                    Account privacy
                </h2>
                <div className="flex gap-2.5 items-center">
                    <Dialog>
                        <DialogTrigger>
                            <Switch checked={user.private}/>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                Are you sure?
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button onClick={handleTogglePrivacy}>
                                        Confirm
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Label className="!font-sans !text-base">
                        Private account
                    </Label>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-left">
                        When your account is public, your profile and post can be seen by every user.
                    </p>
                    <p className="text-left">
                        When your account is private, only people you approve can see your photos and posts.
                        Your extinct followers won't be affected.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Privacy;