import {useState} from "react";
import {DialogClose, DialogContent, DialogFooter, DialogHeader} from "../ui/dialog";
import {Button} from "../ui/button";
import {Loader2, Link, Camera, Trash2} from "lucide-react";
import {useSelector} from "react-redux";
import useFiles from "@/hooks/useFiles.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import initials from "@/functions/initials.ts";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {
    Select, SelectContent, SelectGroup,
    SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select.tsx";
import store from "@/store";
import {updateProfile} from "@/store/slices/usersSlice.ts";
import {fileUrl} from "@/functions/fileUrl";



const EditProfileForm: React.FC = () => {
    const {profile, isUploading} = useSelector((state: any) => state.users);

    const [form, setForm] = useState<any>({
        fullname: profile.fullname,
        bio: profile.bio || "",
        pronouns: profile.pronouns || "hidden",
        location: profile.location || "",
        links: profile.links || []
    });

    const handleUpdateForm = (e: any) => {
        setForm((prevForm: any) => ({...prevForm, [e.target.name]: e.target.value}));
    }
    const handleUpdatePronouns = (value: string) => {
        setForm((prevForm: any) => ({...prevForm, pronouns: value}));
    }

    const handleAddLink = () => {
        setForm((prevForm: any) => ({
            ...prevForm,
            links: [...prevForm.links, ""]
        }));
    };
    const handleRemoveLink = (i: number) => {
        setForm((prevForm: any) => ({
            ...prevForm,
            links: prevForm.links.filter((_: null, index: number) => index !== i)
        }));
    };
    const handleUpdateLink = (e: any) => {
        setForm((prevForm: any) => ({
            ...prevForm,
            links: prevForm.links.map(
                (link: string, index: number) => (index === parseInt(e.target.name) ? e.target.value : link)
            )
        }));
    }

    const profileImage = useFiles();
    const backgroundImage = useFiles();

    const handleUpdate = () => {
        if(profileImage.selectedFiles.length) {
            form.profileImage = profileImage.selectedFiles[0]
        }
        if(backgroundImage.selectedFiles.length) {
            form.backgroundImage = backgroundImage.selectedFiles[0];
        }

        store.dispatch(updateProfile(form));
    }

    return(
        <DialogContent className="px-0 max-w-[1000px]">
            <DialogHeader className="px-3">
                Edit profile
            </DialogHeader>
            <div className="overflow-y-scroll h-full max-h-[80vh]">
                <div className="flex flex-col items-center relative">
                    <img
                        className="aspect-[12/4] w-[100%] max-w-[1200px] object-cover bg-gray-700"
                        src={backgroundImage.getLength() ? backgroundImage.getUrl() : fileUrl(profile.backgroundImage)}
                        draggable={false}
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <label htmlFor="fileInput">
                            <Button size="icon" onClick={backgroundImage.handleOpen}>
                                <Camera className="h-4 w-4"/>
                            </Button>
                        </label>
                    </div>
                    <div className="absolute bottom-0 translate-y-1/2 left-3">
                        <div className="relative">
                            <Avatar className="w-[150px] h-[150px] border-4">
                                <AvatarFallback className="text-6xl uppercase">
                                    {initials(profile.fullname)}
                                </AvatarFallback>
                                <AvatarImage src={profileImage.getLength() ? profileImage.getUrl() : fileUrl(profile.profileImage)}/>
                            </Avatar>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <label htmlFor="fileInput">
                                    <Button size="icon" onClick={profileImage.handleOpen}>
                                        <Camera className="h-4 w-4"/>
                                    </Button>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-10 mt-[100px] px-1">
                    <div className="flex flex-col gap-3">
                        <div>
                            <Label>
                                Full name
                            </Label>
                            <Input
                                name="fullname"
                                onChange={handleUpdateForm}
                                value={form.fullname}
                            />
                        </div>
                        <div>
                            <Label>
                                Bio
                            </Label>
                            <Textarea
                                name="bio"
                                onChange={handleUpdateForm}
                                value={form.bio}
                            />
                        </div>
                    </div>
                    <div>
                        <Label>
                            Location
                        </Label>
                        <Input
                            name="location"
                            onChange={handleUpdateForm}
                            value={form.location}
                        />
                    </div>
                    <div>
                        <Label>
                            Pronouns
                        </Label>
                        <Select
                            defaultValue="hidden"
                            value={form.pronouns}
                            onValueChange={handleUpdatePronouns}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select pronouns" className="w-full"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="hidden">
                                        Don't specify
                                    </SelectItem>
                                    <SelectItem value="he">
                           
                                        He/Him
                                    </SelectItem>
                                    <SelectItem value="she">
                                        She/Her
                                    </SelectItem>
                                    <SelectItem value="they">
                                        They/Them
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-3">
                        {form?.links?.map((link: string, index: number) =>
                            <div className="flex gap-1">
                                <Input
                                    name={index.toString()}
                                    onChange={handleUpdateLink}
                                    value={link}
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleRemoveLink(index)}
                                >
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        )}
                        <Button
                            variant="outline"
                            className="w-min"
                            onClick={handleAddLink}
                        >
                            <Link className="mr-2 h-4 w-4"/>
                            Add link
                        </Button>
                    </div>
                </div>
            </div>
            <input
                type="file"
                accept="image/*"
                style={{display: "none"}}
                onChange={profileImage.handleFileChange}
                ref={profileImage.ref}
            />
            <input
                type="file"
                accept="image/*"
                style={{display: "none"}}
                onChange={backgroundImage.handleFileChange}
                ref={backgroundImage.ref}
            />
            <DialogFooter className="px-3">
                <DialogClose>
                    <Button variant="outline">
                        Cancel
                    </Button>
                </DialogClose>
                <Button onClick={handleUpdate} disabled={isUploading}>
                    {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    ) : null}
                    Confirm
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}

export default EditProfileForm;