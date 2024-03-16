import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "../ui/button";
import server from "@/constants/server";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";



const DeleteAccount: React.FC = () => {
    const user = useSelector((state: any) => state.auth.user);
    const navigate = useNavigate();
    
    const handleDeleteAccount = () => {
        server.delete(`/users/${user._id}`).then(() => {
            navigate("/");
        });
    }
    
    return(
        <div className="flex flex-col gap-2">
            <h2 className="text-2xl text-destructive">
                Delete account
            </h2>
            <span>
                Once you delete your account, there is no going back. Please be certain.
            </span>
            <Dialog>
                <DialogTrigger>
                    <Button variant="destructive" className="w-full">
                        Delete your account
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        Are you sure to delete your account?
                    </DialogHeader>
                    <DialogDescription>
                        Deleting your account is permanent. 
                        All your data will be wiped out immediately and you won't be able to get it back.
                    </DialogDescription>
                    <DialogFooter>
                        <DialogClose>
                            <Button variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                            Confirm delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default DeleteAccount;