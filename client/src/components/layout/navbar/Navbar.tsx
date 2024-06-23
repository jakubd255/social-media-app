import DarkModeToggle from "./DarkModeToggle";
import {Link} from "react-router-dom";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "../../ui/dropdown-menu";
import {Menu, Settings, ShieldAlert, LogOut} from "lucide-react";
import {Button} from "../../ui/button";
import {useSelector} from "react-redux";
import store from "@/store";
import {authActions} from "@/store/slices/authSlice.ts";
import {siderActions} from "@/store/slices/siderSlice.ts";
import SearchButton from "@/components/layout/navbar/SearchButton.tsx";
import React from "react";
import Avatar from "@/components/Avatar";



const Navbar: React.FC<{account?: boolean}> = ({account = false}) => {
    const user = useSelector((state: any) => state.auth.user);

    const handleToggleSidebar = () => store.dispatch(siderActions.toggleOpen());
    const handleLogOut = () => store.dispatch(authActions.logOut());
    
    return(
        <header className="sticky top-0 z-50 w-full border-b backdrop-blur bg-background/95 supports-[backdrop-filter]:bg-background/60 p-2">
            <div className="flex justify-between items-center">
                <div className="flex gap-4 items-center">
                    <Link to="/">
                        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight hover:underline">
                            Social App
                        </h1>
                    </Link>
                    {user ? <SearchButton/> : null}
                </div>
                <div className="flex gap-2">
                    {account ? (
                        <Button
                            variant="outline" size="icon"
                            onClick={handleToggleSidebar}
                        >
                            <Menu className="w-4 h-4"/>
                        </Button>
                    ) : null}
                    <DarkModeToggle/>
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar
                                    name={user.fullname}
                                    image={user.profileImage}
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>
                                    {user.fullname}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem asChild>
                                    <Link to="/settings/account">
                                        <Settings className="mr-2 h-4 w-4"/>
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                {user.admin ? (
                                    <DropdownMenuItem asChild>
                                        <Link to="/admin/users">
                                            <ShieldAlert className="mr-2 w-4 h-4"/>
                                            Admin panel
                                        </Link>
                                    </DropdownMenuItem>
                                ) : null}
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem
                                    onClick={handleLogOut}
                                >
                                    <LogOut className="mr-2 h-4 w-4"/>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : null}
                </div>
            </div>
        </header>
    );
}

export default Navbar;