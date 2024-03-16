import React, {useRef, useState} from "react";
import {useSelector} from "react-redux";
import useFiles from "@/hooks/useFiles.ts";
import {DialogClose, DialogContent, DialogFooter, DialogTitle} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Trash2, Image, Loader2, ListTodo} from "lucide-react";
import {addPost} from "@/store/slices/postsSlice.ts";
import store from "@/store";
import {Group} from "@/types";



const PostForm: React.FC<{group?: Group}> = ({group}) => {
    const user = useSelector((state: any) => state.auth.user);

    const isUploading = useSelector((state: any) => state.posts.isUploading);
    const images = useFiles();

    const [text, setText] = useState<string>();
    const handleUpdateText = (e: any) => setText(e.target.value);

    const [survey, setSurvey] = useState<any>(null);

    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const handleCreateSurvey = () => {
        images.handleReset();
        setSurvey({
            open: false,
            choices: [""]
        });
    }

    const handleToggleOpen = () => {
        setSurvey((prev: any) => ({...prev, open: !prev.open}));
    }

    const handleAddOption = () => {
        setSurvey((prev: any) => ({...prev, choices: [...prev.choices, ""]}));
    }

    const handleRemoveOption = (index: number) => {
        setSurvey((prev: any) => {
            const newChoices = [...prev.choices];
            newChoices.splice(index, 1);
            return {...prev, choices: newChoices};
        });
    }

    const handleUpdateOption = (e: any) => {
        setSurvey((prev: any) => ({
            ...prev, choices: prev.choices.map(
                (choice: string, index: number) => (index === parseInt(e.target.name) ? e.target.value : choice)
            )
        }));
    }

    const handleConfirm = async () => {
        let post: any = {text: text};

        if(survey?.choices?.length && !images.selectedFiles.length) {
            post.survey = {
                open: survey.open,
                choices: survey.choices.map((choice: string) => ({
                    text: choice,
                    votes: []
                }))
            }
        }

        post.time = Math.floor(new Date().getTime()/1000);

        post.userId = user._id;
        if(group?._id) {
            post.groupId = group._id;
        }

        store.dispatch(addPost({post: post, images: images.selectedFiles}));
        
        closeButtonRef.current?.click();
    }

    return(
        <DialogContent className="max-w-[800px]">
            <DialogTitle>
                Add post
            </DialogTitle>
            <div className="flex flex-col gap-10 px-1">
                <div>
                    <Label>
                        Share your thoughts
                    </Label>
                    <Textarea 
                        value={text} 
                        onChange={handleUpdateText}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    {survey?.choices?.length > 0 ? (
                        <div>
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-2">
                                    <Switch
                                        checked={survey.open}
                                        onClick={handleToggleOpen}
                                    />
                                    Open to adding new options
                                </div>
                                {survey.choices.map((choice: string, index: number) =>
                                    <div className="flex gap-1">
                                        <Input
                                            value={choice}
                                            onChange={handleUpdateOption}
                                            name={index.toString()}
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleRemoveOption(index)}
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    className="w-min"
                                    onClick={handleAddOption}
                                >
                                    Add option
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {images.selectedFiles.length == 0 ? (
                                <Button
                                    variant="outline"
                                    className="w-min"
                                    onClick={handleCreateSurvey}
                                >
                                    <ListTodo className="mr-2 h-4 w-4"/>
                                    Create survey
                                </Button>
                            ) : null}
                            <label htmlFor="fileInput">
                                <Button
                                    variant="outline"
                                    className="w-min"
                                    onClick={images.handleOpen}
                                >
                                    <Image className="mr-2 h-4 w-4"/>
                                    Add images
                                </Button>
                            </label>
                            <input
                                type="file"
                                className="hidden"
                                ref={images.ref}
                                onChange={images.handleFileChange}
                                multiple
                            />
                        </>
                    )}
                </div>
                {images.selectedFiles.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {images.selectedFiles.map((file: File, index: number) =>
                            <div className="flex justify-between items-center border rounded-sm p-1">
                                <div className="flex gap-2 items-center">
                                    <img 
                                        src={URL.createObjectURL(file)} 
                                        className="max-h-[50px] max-w-[500px]"
                                    />
                                    <span>
                                        {file.name}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => images.deleteByIndex(index)}
                                >
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
            <DialogFooter>
                <DialogClose>
                    <Button 
                        variant="outline" 
                        ref={closeButtonRef}
                    >
                        Cancel
                    </Button>
                </DialogClose>
                <Button 
                    onClick={handleConfirm} 
                    disabled={isUploading}
                >
                    {isUploading ?
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    : null}
                    Confirm
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}

export default PostForm;