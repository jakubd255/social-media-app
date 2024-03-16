import {Link, Outlet, useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import initials from "@/functions/initials.ts";
import {Separator} from "@/components/ui/separator.tsx";
import React, {useEffect} from "react";
import {getProfile} from "@/store/slices/usersSlice.ts";
import store from "@/store";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {AlignJustify, ClipboardEdit, Info, LayoutGrid, Plus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import DestroyableDialog from "@/components/DestroyableDialog.tsx";
import PostForm from "@/components/forms/PostForm.tsx";
import EditProfileForm from "@/components/forms/EditProfileForm.tsx";
import ProfileButton from "@/components/user/ProfileButton.tsx";
import getPronouns from "@/functions/pronouns.ts";
import {Dialog, DialogContent, DialogHeader} from "@/components/ui/dialog.tsx";
import ProfileLoadingPage from "@/components/loading/ProfileLoadingPage.tsx";
import {ProfileNotFound} from "@/pages/error";
import imageUrl from "@/functions/imageUrl";



const ProfilePage: React.FC = () => {
    const {id} = useParams();
    const page = location.pathname.split("/").pop() || "";
    const navigate = useNavigate();

    const user = useSelector((state: any) => state.auth.user);
    const {profile, isInitialized, isLoading, error} = useSelector((state: any) => state.users);

    useEffect(() => {
        store.dispatch(getProfile(id));
    }, [id]);

    const canBeSeen = !profile?.private || profile?.isFollowed || profile?._id === user?._id;

    if(isInitialized && !isLoading && profile && user) return(
        <div className="flex flex-1 justify-center pb-5 px-2">
            <div>
                <div className="relative">
                    <div className="w-full bg-image-wrapper rounded-lg rounded-t-none">
                        <img
                            src={profile.backgroundImage && imageUrl(profile.backgroundImage)}
                            className="aspect-[12/4] w-[1200px] object-cover block"
                            draggable={false}
                        />
                    </div>
                    <Avatar className="absolute bottom-0 left-5 translate-y-1/2 w-[200px] h-[200px] border-4">
                        <AvatarImage src={profile.profileImage && imageUrl(profile.profileImage)}/>
                        <AvatarFallback className="text-9xl uppercase">
                            {initials(profile.fullname)}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex justify-end py-4">
                    {profile._id == user._id ? (
                        <div className="flex gap-2.5">
                            <DestroyableDialog
                                trigger={(
                                    <Button variant="outline" className="w-full">
                                        <Plus className="mr-2 h-4 w-4"/>
                                        Add post
                                    </Button>
                                )}
                                content={<PostForm/>}
                            />
                            <DestroyableDialog
                                trigger={(
                                    <Button>
                                        <ClipboardEdit className="mr-2 h-4 w-4"/>
                                        Edit profile
                                    </Button>
                                )}
                                content={<EditProfileForm/>}
                            />
                        </div>
                    ) : (
                        <ProfileButton profile={profile}/>
                    )}
                </div>
                <div className="mt-[50px] flex flex-col items-start gap-6">
                    <div className="flex flex-col items-start gap-2.5">
                        <div className="flex flex-col">
                            <h1 className="text-4xl">
                                {profile.fullname}
                            </h1>
                            <div className="flex gap-2.5 items-center">
                                <h2 className="text-xl">
                                    @{profile.username}
                                </h2>
                                <span>
                                    {getPronouns(profile.pronouns)}
                                </span>
                            </div>
                        </div>

                        <span className="text-left">
                            {profile.bio?.split("\n")[0]}
                        </span>

                        <div className="flex gap-5">
                            <Link to="followers" className="hover:underline">
                                {profile.followers || 0} Followers
                            </Link>
                            <Link to="following" className="hover:underline">
                                {profile.following || 0} Following
                            </Link>
                        </div>
                    </div>
                    {canBeSeen ? (
                        <Tabs defaultValue={page == id ? "default" : page}>
                            <TabsList>
                                <TabsTrigger value="default" asChild>
                                    <Link to="">
                                        <AlignJustify className="mr-2 h-4 w-4"/>
                                        Posts
                                    </Link>
                                </TabsTrigger>
                                <TabsTrigger value="gallery" asChild>
                                    <Link to="gallery">
                                        <LayoutGrid className="mr-2 h-4 w-4"/>
                                        Gallery
                                    </Link>
                                </TabsTrigger>
                                <TabsTrigger value="about" asChild>
                                    <Link to="about">
                                        <Info className="mr-2 h-4 w-4"/>
                                        About
                                    </Link>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    ) : (
                        <div>
                            <h3 className="text-3xl">
                                This account is private
                            </h3>
                            <span>
                                Follow this account to see posts and pictures.
                            </span>
                        </div>
                    )}
                </div>
                <Separator/>
                {["following", "followers", "follow-requests"].includes(page) ? (
                    <Dialog onOpenChange={() => navigate(`/profile/${profile._id}`)} open>
                        <DialogContent>
                            <DialogHeader>
                                <Tabs defaultValue={page}>
                                    <TabsList>
                                        <TabsTrigger value="followers" asChild>
                                            <Link to={`/profile/${profile._id}/followers`}>
                                                Followers
                                            </Link>
                                        </TabsTrigger>
                                        <TabsTrigger value="following" asChild>
                                            <Link to={`/profile/${profile._id}/following`}>
                                                Following
                                            </Link>
                                        </TabsTrigger>
                                        {(profile.private && profile._id == user._id) ? (
                                            <TabsTrigger value="follow-requests" asChild>
                                                <Link to={`/profile/${profile._id}/follow-requests`}>
                                                    Requests
                                                </Link>
                                            </TabsTrigger>
                                        ) : null}
                                    </TabsList>
                                </Tabs>
                            </DialogHeader>
                            <Outlet
                                context={{
                                    choice: page,
                                }}
                                key={id+page}
                            />
                        </DialogContent>
                    </Dialog>
                ) : canBeSeen ? (
                    <Outlet
                        context={{
                            choice: "profile",
                            profile: profile,
                            message: "No posts yet"
                        }}
                        key={id}
                    />
                ) : null}
            </div>
        </div>
    );
    else if(isLoading) {
        return <ProfileLoadingPage/>
    }
    else if(error == 404) {
        return <ProfileNotFound/>
    }
}

export default ProfilePage;