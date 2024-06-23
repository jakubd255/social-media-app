import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import useFiles from "@/hooks/useFiles";
import {useOutletContext} from "react-router-dom";
import {Camera, Loader2} from "lucide-react";
import {useSelector} from "react-redux";
import store from "@/store";
import {updateGroup} from "@/store/slices/groupsSlice.ts";
import {fileUrl} from "@/functions/fileUrl";



const GroupDetails: React.FC = () => {
    const {group} = useOutletContext<any>();
    const isUploading = useSelector((state: any) => state.groups.isUploading);

    const [form, setForm] = useState<any>();

    useEffect(() => {
        setForm({
            name: group?.name,
            description: group?.description
        });
    }, [group]);

    const handleUpdate = (e: any) => {
        setForm((form: any) => ({
            ...form, [e.target.name]: e.target.value
        }));
    }

    const backgroundImage = useFiles();

    const handleSave = async () => {
        const data = {
            name: form.name,
            description: form.description,
        };

        store.dispatch(updateGroup({
            id: group._id, 
            form: data, 
            backgroundImage: backgroundImage
        }));
        backgroundImage.handleReset();
    }

    if(group) return(
        <div className="flex flex-col w-full max-w-[900px] gap-10">
            <div className="flex flex-col items-center bg-image-wrapper rounded-lg rounded-t-none relative">
                <img
                    className="aspect-[12/4] w-[100%] max-w-[1200px] object-cover bg-gray-700"
                    src={backgroundImage.getLength() ? backgroundImage.getUrl() : fileUrl(group.backgroundImage)}
                    draggable={false}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <label htmlFor="fileInput">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={backgroundImage.handleOpen}
                        >
                            <Camera className="h-4 w-4"/>
                        </Button>
                    </label>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-col gap-[10px]">
                    <div>
                        <Label>
                            Group name
                        </Label>
                        <Input
                            name="name"
                            value={form?.name}
                            onChange={handleUpdate}
                        />
                    </div>
                    <div>
                        <Label>
                            Description
                        </Label>
                        <Textarea
                            name="description"
                            value={form?.description}
                            onChange={handleUpdate}
                        />
                    </div>
                </div>
                <input
                    type="image"
                    accept="image/*"
                    onChange={backgroundImage.handleFileChange}
                    style={{display: "none"}}
                    ref={backgroundImage.ref}
                />
            </div>

            <div>
                {(group?.name !== form?.name || group.description !== form.description || backgroundImage.getLength()) ? (
                    <Button 
                        onClick={handleSave} 
                        disabled={isUploading}
                    >
                        {isUploading ?
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        : null}
                        {isUploading ? "Uploading" : "Confirm"}
                    </Button>
                ) : null}
            </div>
        </div>
    );
}

export default GroupDetails;