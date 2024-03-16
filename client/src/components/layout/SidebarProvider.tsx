import {Link, useLocation, useParams} from "react-router-dom";
import {Button} from "../ui/button";
import { 
    ArrowLeftFromLine, Bookmark, ClipboardEdit, 
    Home, ListOrdered, LockKeyhole, 
    Search, Settings2, User, 
    UserCog, Users 
} from "lucide-react";
import {Separator} from "../ui/separator";
import {useSelector} from "react-redux";
import React from "react";



const width = "2xl:w-[250px] lg:w-[160px] lg:block";
const sidebar = "lg:sticky fixed top-0 z-10 max-w-[250px] w-full";

const Sidebar: React.FC = () => {
    const user = useSelector((state: any) => state.auth.user);

    const {id} = useParams();
    const location = useLocation();

    const currentPath = location.pathname.split('/').filter(Boolean);
    const currentPage = currentPath[0] || "home";

    if(user) return(
        <div className={`${width} ${sidebar} top-[57px] box-border p-2 h-[calc(100vh-57px)] backdrop-blur bg-background/95 supports-[backdrop-filter]:bg-background/60 border-r`}>
            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-[10px]">
                    <Button
                        variant= {user._id === id ? "default" : "ghost"}
                        className="flex justify-start"
                        asChild
                    >
                        <Link to={`/profile/${user._id}`}>
                            <User className="mr-2 h-4 w-4"/>
                            Profile
                        </Link>
                    </Button>
                    <Button
                        variant= {currentPage === "home" ? "default" : "ghost"}
                        className="flex justify-start"
                        asChild
                    >
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4"/>
                            Home
                        </Link>
                    </Button>
                    <Button
                        variant= {currentPage === "explore" ? "default" : "ghost"}
                        className="flex justify-start"
                        asChild
                    >
                        <Link to="/explore/posts">
                            <Search className="mr-2 h-4 w-4"/>
                            Explore
                        </Link>
                    </Button>
                    <Button
                        variant= {currentPage === "saved" ? "default" : "ghost"}
                        className="flex justify-start"
                        asChild
                    >
                        <Link to="/saved">
                            <Bookmark className="mr-2 h-4 w-4"/>
                            Saved
                        </Link>
                    </Button>
                    <Button
                        variant= {(currentPage === "groups" && !currentPath[1]) ? "default" : "ghost"}
                        className="flex justify-start"
                        asChild
                    >
                        <Link to="/groups">
                            <Users className="mr-2 h-4 w-4"/>
                            Groups
                        </Link>
                    </Button>
                    {(id && currentPage === "groups" && currentPath[2] === "admin") ?
                        <>
                            <Separator/>
                            <Button
                                variant="ghost"
                                className="flex justify-start"
                                asChild
                            >
                                <Link to={`/groups/${id}`}>
                                    <ArrowLeftFromLine className="mr-2 h-4 w-4"/>
                                    Back
                                </Link>
                            </Button>
                            <Button
                                variant= {(currentPage === "groups" && currentPath[2] === "admin" && !currentPath[3]) ? "default" : "ghost"}
                                className="flex justify-start"
                                asChild
                            >
                                <Link to={`/groups/${id}/admin`}>
                                    <ClipboardEdit className="mr-2 h-4 w-4"/>
                                    Edit details
                                </Link>
                            </Button>
                            <Button
                                variant= {(currentPage === "groups" && currentPath[3] === "rules") ? "default" : "ghost"}
                                className="flex justify-start"
                                asChild
                            >
                                <Link to={`/groups/${id}/admin/rules`}>
                                    <ListOrdered className="mr-2 h-4 w-4"/>
                                    Group rules
                                </Link>
                            </Button>
                            <Button
                                variant= {(currentPage === "groups" && currentPath[3] === "privileges") ? "default" : "ghost"}
                                className="flex justify-start"
                                asChild
                            >
                                <Link to={`/groups/${id}/admin/privileges`}>
                                    <Settings2 className="mr-2 h-4 w-4"/>
                                    Privileges
                                </Link>
                            </Button>
                        </>
                    : (currentPage === "settings") ?
                        <>
                            <Separator/>
                            <Button
                                variant= {currentPath[1] === "account" ? "default" : "ghost"}
                                className="flex justify-start"
                                asChild
                            >
                                <Link to="/settings/account">
                                    <UserCog className="mr-2 h-4 w-4"/>
                                    Account
                                </Link>
                            </Button>
                            <Button
                                variant= {currentPath[1] === "privacy" ? "default" : "ghost"}
                                className="flex justify-start"
                                asChild
                            >
                                <Link to="/settings/privacy">
                                    <LockKeyhole className="mr-2 h-4 w-4"/>
                                    Privacy
                                </Link>
                            </Button>
                        </>
                    : (currentPage === "admin") ?
                        <>
                            <Separator/>
                            <Button
                                variant= {currentPath[1] === "users" ? "default" : "ghost"}
                                className="flex justify-start"
                                asChild
                            >
                                <Link to="/admin/users">
                                    Users
                                </Link>
                            </Button>
                            <Button
                                variant= {currentPath[1] === "posts" ? "default" : "ghost"}
                                className="flex justify-start"
                                asChild
                            >
                                <Link to="/admin/posts">
                                    Posts
                                </Link>
                            </Button>
                            <Button
                                variant= {currentPath[1] === "comments" ? "default" : "ghost"}
                                className="flex justify-start"
                                asChild
                            >
                                <Link to="/admin/comments">
                                    Comments
                                </Link>
                            </Button>
                            <Button
                                variant= {currentPath[1] === "groups" ? "default" : "ghost"}
                                className="flex justify-start"
                                asChild
                            >
                                <Link to="/admin/groups">
                                    Groups
                                </Link>
                            </Button>
                        </>
                    : null}
                </div>
                
            </div>
        </div>
    );
}

const SidebarProvider: React.FC<any> = ({children}) => {
    const isOpen = useSelector((state: any) => state.sider.isOpen);

    return(
        <div className="flex">
            {isOpen ? <Sidebar/> : null}
            {children}
            {isOpen ? <div className={`${width} hidden`}/> : null}
        </div>
    );
}

export default SidebarProvider;