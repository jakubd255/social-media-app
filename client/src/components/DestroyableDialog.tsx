import React, {useState} from "react";
import {Dialog, DialogTrigger} from "./ui/dialog";



interface DestroyableDialogProps {
    content: any;
    trigger: any;
}

const DestroyableDialog: React.FC<DestroyableDialogProps> = ({content, trigger}) => {
    const [open, setOpen] = useState(false);

    return(
        <Dialog onOpenChange={() => setOpen(open => !open)}>
            <DialogTrigger>
                {trigger}
            </DialogTrigger>
            {open ? content : null}
        </Dialog>
    );
}

export default DestroyableDialog;