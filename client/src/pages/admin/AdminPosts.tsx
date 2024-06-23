import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import server from "@/constants/server";
import {SurveyChoice} from "@/types";
import {MoreHorizontal, Trash2} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import initials from "@/functions/initials.ts";
import {fileUrl} from "@/functions/fileUrl";
import checkFileType from "@/functions/checkFileType";



const AdminPosts: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const {page, setPage, input, setPages}: any = useOutletContext();
    
    useEffect(() => {
       server.get(`/posts/admin/${input}`, {params: {page: page}}).then(response => {
            setPosts(response.data.posts);
            setPages(response.data.pages);
        });
    }, [page, setPage, input]);

    const removePost = (id: string) => {
        server.delete(`/posts/${id}`);
        setPosts(posts => posts.filter(post => post._id != id));
    }

    return(
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        User
                    </TableHead>
                    <TableHead>
                        Text
                    </TableHead>
                    <TableHead>
                        Files
                    </TableHead>
                    <TableHead>
                        Survey
                    </TableHead>
                    <TableHead>
                        Likes
                    </TableHead>
                    <TableHead>
                        Comments
                    </TableHead>
                    <TableHead>
                        Group
                    </TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {posts.map(p =>
                    <TableRow>
                        <TableCell>
                            {p.user ? (
                                <div className="flex gap-2 py-0">
                                    <Avatar>
                                        <AvatarImage src={fileUrl(p.user.profileImage)}/>
                                        <AvatarFallback>
                                            {initials(p.user.fullname)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span>
                                            {p.user.fullname}
                                        </span>
                                        <span>
                                            @{p.user.username}
                                        </span>
                                    </div>
                                </div>
                            ) : "-"}
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-wrap max-w-[200px]">
                                {p.text}
                            </div>
                        </TableCell>
                        <TableCell className="py-0">
                            {p.files.length ? (
                                <div className="flex gap-2 max-w-[500px]">
                                    {p.files.map((file: string) => (
                                        <>
                                            {checkFileType(file) == "image" ? (
                                                <img src={fileUrl(file)} className="max-w-[100px] max-h-[60px]"/>
                                            ) : checkFileType(file) == "video" ? (
                                                <video src={fileUrl(file)} className="max-w-[100px] max-h-[60px]"/>
                                            ) : (
                                                <a
                                                    className="hover:underline"
                                                    href={fileUrl(file)} 
                                                    download
                                                >
                                                    {file.split("-")[1]}
                                                </a>
                                            )}
                                        </>
                                    ))}
                                </div>
                            ) : null}
                        </TableCell>
                        <TableCell>
                            {p.survey ? (
                                <div className="flex flex-col gap-1">
                                    {p.survey.choices.map((choice: SurveyChoice) => 
                                        <div className="flex justify-between gap-5">
                                            <span>
                                                {choice.text}
                                            </span>
                                            <span>
                                                {choice.votes || 0} Votes
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ): null}
                        </TableCell>
                        <TableCell>
                            {p.likes|| 0}
                        </TableCell>
                        <TableCell>
                            {p.comments || 0}
                        </TableCell>
                        <TableCell className="py-0">
                            {p.group ? (
                                <div className="flex gap-1 items-center">
                                    {p.group.backgroundImage ?
                                        <img 
                                            src={fileUrl(p.group.backgroundImage)}
                                            className="max-w-[100px] aspect-[12/4] object-cover"
                                            draggable={false}
                                        />
                                    : null}
                                    {p.group.name}
                                </div>
                            ) : null}
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button 
                                        variant="outline" 
                                        size="icon" 
                                        className="w-[30px] h-[30px]"
                                    >
                                        <MoreHorizontal className="h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem 
                                        className="!text-destructive" 
                                        onClick={() => removePost(p._id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4"/>
                                        Remove
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

export default AdminPosts;