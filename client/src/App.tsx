import "./styles/App.css";
import {useCookies} from "react-cookie";
import LoginPage from "./pages/auth/LoginPage.tsx";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import {BrowserRouter as Router, Routes, Route, Navigate, Outlet} from "react-router-dom";
import Navbar from "./components/layout/navbar/Navbar.tsx";
import React, {useEffect} from "react";
import server from "@/constants/server.ts";
import store from "./store/index.ts";
import {authActions} from "./store/slices/authSlice.ts";
import SidebarProvider from "./components/layout/SidebarProvider.tsx";
import Home from "./pages/Home.tsx";
import Posts from "./pages/Posts.tsx";
import AboutProfile from "@/pages/profile/AboutProfile.tsx";
import {NotFound} from "@/pages/error";
import Saved from "./pages/Saved.tsx";
import ImageGallery from "@/pages/ImageGallery.tsx";
import Groups from "./pages/groups/Groups.tsx";
import ProfilePage from "./pages/profile/ProfilePage.tsx";
import GroupPage from "./pages/groups/GroupPage.tsx";
import AboutGroup from "./pages/groups/AboutGroup.tsx";
import GroupAdminPage from "./pages/groups/admin/GroupAdminPage.tsx";
import GroupDetails from "./pages/groups/admin/GroupDetails.tsx";
import GroupRules from "./pages/groups/admin/GroupRules.tsx";
import GroupPrivilages from "./pages/groups/admin/GroupPrivilages.tsx";
import SettingsPage from "./pages/settings/SettingsPage.tsx";
import Account from "./pages/settings/Account.tsx";
import Privacy from "./pages/settings/Privacy.tsx";
import UsersList from "@/pages/UsersList.tsx";
import Explore from "./pages/Explore.tsx";
import JoinToHidden from "./pages/groups/JoinToHidden.tsx";
import AdminPage from "./pages/admin/AdminPage.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminPosts from "./pages/admin/AdminPosts.tsx";
import AdminComments from "./pages/admin/AdminComments.tsx";
import AdminGroups from "./pages/admin/AdminGroups.tsx";
import {useSelector} from "react-redux";



const App: React.FC = () => {
    const [cookie] = useCookies(["is-logged"]);
    const user = useSelector((state: any) => state.auth.user);

    useEffect(() => {
        if(cookie["is-logged"]) {
            server.get("/users/").then(response => {
                store.dispatch(authActions.logIn(response.data.user));
            });
        }
    }, [cookie]);

    //If user is logged in
    if(cookie["is-logged"] && user !== null) return(
        <Router>
            <Navbar account/>
            <Routes>
                <Route path="/" element={<SidebarProvider><Outlet/></SidebarProvider>}>
                    <Route path="/" element={<Home/>}>
                        <Route index element={<Posts/>}/>
                    </Route>

                    <Route path="/explore" element={<Explore/>}>
                        <Route path="posts/:search?" element={<Posts/>}/>
                        <Route path="users/:search?" element={<UsersList/>}/>
                        <Route path="groups/:search?" element={<Groups choice="explore"/>}/>
                    </Route>

                    <Route path="/saved" element={<Saved/>}>
                        <Route index element={<Posts/>}/>
                    </Route>

                    <Route path="profile/:id" element={<ProfilePage/>}>
                        <Route index element={<Posts/>}/>
                        <Route path="gallery" element={<ImageGallery/>}/>
                        <Route path="about" element={<AboutProfile/>}/>
                        <Route path="following" element={<UsersList/>}/>
                        <Route path="followers" element={<UsersList/>}/>
                        <Route path="follow-requests" element={<UsersList/>}/>
                    </Route>

                    <Route path="groups" element={<Groups/>}/>

                    <Route path="groups/:id" element={<GroupPage/>}>
                        <Route index element={<Posts/>}/>
                        <Route path="gallery" element={<ImageGallery/>}/>
                        <Route path="about" element={<AboutGroup/>}/>
                        <Route path="members" element={<UsersList/>}/>
                        <Route path="group-requests" element={<UsersList/>}/>

                        <Route path="admin" element={<GroupAdminPage/>}>
                            <Route index element={<GroupDetails/>}/>
                            <Route path="rules" element={<GroupRules/>}/>
                            <Route path="privileges" element={<GroupPrivilages/>}/>
                        </Route>
                    </Route>

                    <Route path="groups/join/:id" element={<JoinToHidden/>}/>

                    <Route path="settings" element={<SettingsPage/>}>
                        <Route path="account" element={<Account/>}/>
                        <Route path="privacy" element={<Privacy/>}/>
                    </Route>

                    <Route path="admin" element={<AdminPage/>}>
                        <Route path="users" element={<AdminUsers/>}/>
                        <Route path="posts/:choice?/:id?" element={<AdminPosts/>}/>
                        <Route path="comments" element={<AdminComments/>}/>
                        <Route path="groups" element={<AdminGroups/>}/>
                    </Route>

                    <Route path="*" element={<NotFound/>}/>
                </Route>
            </Routes>
        </Router>
    );
    //If users isn't logged in
    else if(!cookie["is-logged"]) return(
        <Router>
            <Routes>
                <Route path="log-in" element={<LoginPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>
                <Route path="*" element={<Navigate to="/log-in" />} />
            </Routes>
        </Router>
    );
}

export default App;