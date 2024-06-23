import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow}  from "@/components/ui/table";
import server from "@/constants/server";
import {fileUrl} from "@/functions/fileUrl";
import {MoreHorizontal, Trash2} from "lucide-react";
import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";



const AdminGroups: React.FC = () => {
    const [groups, setGroups] = useState<any[]>([]);
    const {page, setPage, input, setPages}: any = useOutletContext();
    
    useEffect(() => {
       server.get(`/groups/admin/${input}`, {params: {page: page}}).then(response => {
            setGroups(response.data.groups);
            setPages(response.data.pages);
        });
    }, [page, setPage, input]);

    const removeGroup = (id: string) => {
        server.delete(`/groups/${id}`);
        setGroups(groups => groups.filter(group => group._id != id));
    }
    
    return(
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        Image
                    </TableHead>
                    <TableHead>
                        Name
                    </TableHead>
                    <TableHead>
                        Description
                    </TableHead>
                    <TableHead>
                        Type
                    </TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {groups.map(g =>
                    <TableRow>
                        <TableCell>
                            {g.backgroundImage ? (
                                <img 
                                    src={fileUrl(g.backgroundImage)} 
                                    className="max-w-[100px] aspect-[12/4] object-cover"
                                />
                            ) : null}
                        </TableCell>
                        <TableCell>
                            {g.name}
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-wrap max-w-[200px]">
                                {g.description}
                            </div>
                        </TableCell>
                        <TableCell>
                            {g.private ? (g.hidden ? "Hidden" : "Private") : "Public"}
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
                                        onClick={() => removeGroup(g._id)}
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

export default AdminGroups;