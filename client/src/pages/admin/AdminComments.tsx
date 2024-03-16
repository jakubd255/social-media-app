import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button } from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import server from "@/constants/server";
import {MoreHorizontal, Trash2} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import initials from "@/functions/initials.ts";
import imageUrl from "@/functions/imageUrl";



const AdminComments: React.FC = () => {
    const [comments, setComments] = useState<any[]>([]);
    const {page, setPage, input, setPages}: any = useOutletContext();
    
    useEffect(() => {
       server.get(`/comments/admin/${input}`, {params: {page: page}}).then(response => {
            setComments(response.data.comments);
            setPages(response.data.pages);
        });
    }, [page, setPage, input]);

    const removeComment = (id: string) => {
        server.delete(`/comments/${id}`);
        setComments(comments => comments.filter(comment => comment._id != id));
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
                        Post ID
                    </TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {comments.map(c =>
                    <TableRow>
                        <TableCell className="py-0">
                            {c.user ? (
                                <div className="flex gap-2">
                                    <Avatar>
                                        <AvatarImage src={imageUrl(c.user.profileImage)}/>
                                        <AvatarFallback>
                                            {initials(c.user.fullname)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span>
                                            {c.user.fullname}
                                        </span>
                                        <span>
                                            @{c.user.username}
                                        </span>
                                    </div>
                                </div>
                            ) : "-"}
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-wrap max-w-[200px]">
                                {c.text}
                            </div>
                        </TableCell>
                        <TableCell>
                            {c.postId}
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
                                        onClick={() => removeComment(c._id)}
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

export default AdminComments;