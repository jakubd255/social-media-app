import React, {useRef, useState} from "react";
import {useSelector} from "react-redux";
import useFiles from "@/hooks/useFiles.ts";
import {DialogClose, DialogContent, DialogFooter, DialogTitle} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Trash2, Image, Loader2, ListTodo, File} from "lucide-react";
import {addPost} from "@/store/slices/postsSlice.ts";
import store from "@/store";
import {Group} from "@/types";
import checkFileType from "@/functions/checkFileType";



const PostForm: React.FC<{group?: Group}> = ({group}) => {
    const user = useSelector((state: any) => state.auth.user);

    const isUploading = useSelector((state: any) => state.posts.isUploading);
    const files = useFiles();

    const [text, setText] = useState<string>();
    const handleUpdateText = (e: any) => setText(e.target.value);

    const [survey, setSurvey] = useState<any>(null);

    const closeButtonRef = useRef<HTMLButtonElement>(null);

    const handleCreateSurvey = () => {
        files.handleReset();
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
        const post: any = {text: text};

        if(survey?.choices?.length && !files.selectedFiles.length) {
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

        store.dispatch(addPost({post: post, files: files.selectedFiles}));
        
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
                            {files.selectedFiles.length == 0 ? (
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
                                    onClick={files.handleOpen}
                                >
                                    <Image className="mr-2 h-4 w-4"/>
                                    Add files
                                </Button>
                            </label>
                            <input
                                type="file"
                                className="hidden"
                                ref={files.ref}
                                onChange={files.handleFileChange}
                                multiple
                            />
                        </>
                    )}
                </div>
                {files.selectedFiles.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {files.selectedFiles.map((file: File, index: number) =>
                            <div className="flex justify-between items-center border rounded-sm p-1">
                                <div className="flex gap-2 items-center">
                                    {checkFileType(file.name) === "image" ? (
                                        <img 
                                            src={URL.createObjectURL(file)} 
                                            className="max-h-[50px] max-w-[500px]"
                                        />
                                    ) : checkFileType(file.name) === "video" ? (
                                        <video 
                                            src={URL.createObjectURL(file)} 
                                            className="max-h-[50px] max-w-[500px]"
                                        />
                                    ) : (
                                        <File className="icon"/>
                                    )}
                                    <span>
                                        {file.name}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => files.deleteByIndex(index)}
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