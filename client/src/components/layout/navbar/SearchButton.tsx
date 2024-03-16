import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Search} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "../../ui/avatar";
import server from "@/constants/server";
import initials from "@/functions/initials.ts";
import {Link, useParams} from "react-router-dom";
import {Input} from "../../ui/input";
import {CommandDialog, CommandEmpty, CommandGroup, CommandItem, CommandList} from "@/components/ui/command";
import {useSelector} from "react-redux";
import imageUrl from "@/functions/imageUrl";



const SearchButton: React.FC = () => {
    const {search} = useParams();

    const [input, setInput] = useState<string>(search || "");
    const user =  useSelector((state: any) => state.auth.user);

    const [users, setUsers] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);

    const [open, setOpen] = useState<boolean>(false);
    const handleToggleOpen = () => setOpen(open => !open);

    useEffect(() => {
        if(input) {
            server.get(`/users/search/${input}`).then(response => {
                setUsers(response.data.users);
            });
            server.get(`/groups/search/${input}`, user.header).then(response => {
                setGroups(response.data.groups);
            });
        }
        else {
            setUsers([]);
            setGroups([]);
        }
    }, [input]);

    const handleReset = () => {
        handleToggleOpen();
        setInput("");
    }

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if(e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleToggleOpen();
            }
        }

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return(
        <>
            <Button 
                variant="outline" 
                className="flex justify-between gap-10" 
                onClick={handleToggleOpen}
            >
                <div className="xs:flex hidden gap-2">
                    Search...
                    <kbd>
                        <span>⌘</span>K
                    </kbd>
                </div>
                <Search className="w-4 h-4 ml-auto mr-auto"/>
            </Button>
            <CommandDialog
                open={open}
                onOpenChange={handleToggleOpen}
            >
                <div className="flex items-center">
                    <Search className="h-5 w-5 mx-2"/>
                    <Input 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)}
                        className="border-0 focus-visible:ring-transparent py-3 px-0 h-12"
                        placeholder="Search..."
                    />
                </div>
                {input ? (
                    <>
                        <CommandList>
                            <CommandGroup heading="Users">
                                {users.length > 0 ? users.map((user: any) =>
                                    <Link
                                        to={`/profile/${user._id}`}
                                        onClick={handleReset}
                                    >
                                        <CommandItem className="flex gap-2 cursor-pointer">
                                            <Avatar>
                                                <AvatarFallback>
                                                    {initials(user.fullname)}
                                                </AvatarFallback>
                                                <AvatarImage src={user.profileImage && imageUrl(user.profileImage)}/>
                                            </Avatar>
                                            <div className="flex flex-col">
                                            <span>
                                                {user.fullname}
                                            </span>
                                                <span>
                                                @{user.username}
                                            </span>
                                            </div>
                                        </CommandItem>
                                    </Link>
                                ) : (
                                    <CommandEmpty>
                                        No results found.
                                    </CommandEmpty>
                                )}
                            </CommandGroup>
                            <CommandGroup heading="Groups">
                                {groups.length > 0 ? groups.map((group: any) =>
                                    <Link
                                        to={`/groups/${group._id}`}
                                        onClick={handleReset}
                                    >
                                        <CommandItem className="flex gap-2 cursor-pointer">
                                            <Avatar className="!rounded-sm">
                                                <AvatarFallback>
                                                    {initials(group.name)}
                                                </AvatarFallback>
                                                <AvatarImage src={group.backgroundImage && imageUrl(group.backgroundImage)}/>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span>
                                                    {group.name}
                                                </span>
                                            </div>
                                        </CommandItem>
                                    </Link>
                                ) : (
                                    <CommandEmpty>
                                        No results found.
                                    </CommandEmpty>
                                )}
                            </CommandGroup>
                        </CommandList>
                        <div className="p-3 flex justify-end w-full">
                            <Button onClick={handleToggleOpen} asChild>
                                <Link to={`/explore/posts/${input}`}>
                                    Search
                                </Link>
                            </Button>
                        </div>
                    </>
                ) : null}
            </CommandDialog>
        </>
    );
}

export default SearchButton;