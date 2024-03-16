import server from "@/constants/server";
import React, {useEffect, useState} from "react";
import {Link, useOutletContext} from "react-router-dom";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {MoreHorizontal, Trash2, User} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import initials from "@/functions/initials.ts";
import {useSelector} from "react-redux";
import imageUrl from "@/functions/imageUrl";



const AdminUsers: React.FC = () => {
    const user = useSelector((state: any) => state.auth.user);
    const [users, setUsers] = useState<any[]>([]);
    const {page, setPage, input, setPages}: any = useOutletContext();
    
    useEffect(() => {
       server.get(`/users/admin/${input}`, {params: {page: page}}).then(response => {
            setUsers(response.data.users);
            setPages(response.data.pages);
        });
    }, [page, setPage, input]);

    const removeUser = (id: string) => {
        server.delete(`/users/${id}`);
        setUsers(users => users.filter(user => user._id != id));
    }

    return(
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                    </TableHead>
                    <TableHead>
                        Username
                    </TableHead>
                    <TableHead>
                        Full name
                    </TableHead>
                    <TableHead>
                        E-mail
                    </TableHead>
                    <TableHead>
                        Type
                    </TableHead>
                    <TableHead>
                        Role
                    </TableHead>
                    <TableHead>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map(u =>
                    <TableRow>
                        <TableCell className="py-0">
                            <Avatar>
                                <AvatarImage src={imageUrl(u.profileImage)}/>
                                <AvatarFallback>
                                    {initials(u.fullname)}
                                </AvatarFallback>
                            </Avatar>
                        </TableCell>
                        <TableCell>
                            @{u.username}
                        </TableCell>
                        <TableCell>
                            {u.fullname}
                        </TableCell>
                        <TableCell>
                            {u.email}
                        </TableCell>
                        <TableCell>
                            {u.private ? "Private" : "Public"}
                        </TableCell>
                        <TableCell>
                            {u.admin ? 
                                <Badge>
                                    Admin
                                </Badge>
                            : null}
                        </TableCell>
                        <TableCell>
                            {u._id !== user._id ? 
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Button variant="outline" size="icon" className="w-[30px] h-[30px]">
                                            <MoreHorizontal className="h-4 w-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild>
                                            <Link to={`/profile/${u._id}`} target="_blank">
                                                <User className="mr-2 h-4 w-4"/>
                                                Show
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="!text-destructive" onClick={() => removeUser(u._id)}>
                                            <Trash2 className="mr-2 h-4 w-4"/>  
                                            Remove user
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            : null}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

export default AdminUsers