import {Link, Outlet, useLocation, useParams} from "react-router-dom";
import {AlignJustify, Info, LayoutGrid, Plus, Users} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import PostForm from "@/components/forms/PostForm";
import permission from "@/functions/permission.ts";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import DestroyableDialog from "@/components/DestroyableDialog";
import {Button} from "@/components/ui/button";
import {useSelector} from "react-redux";
import React, {useEffect} from "react";
import {getChosenGroup} from "@/store/slices/groupsSlice.ts";
import store from "@/store";
import GroupButton from "@/components/group/GroupButton.tsx";
import GroupTypeInfo from "@/components/group/GroupTypeInfo.tsx";
import GroupLoadingPage from "@/components/loading/GroupLoadingPage.tsx";
import {GroupNotFound} from "@/pages/error";
import InviteToGroup from "@/components/group/InviteToGroup.tsx";
import {fileUrl} from "@/functions/fileUrl";



const GroupPage: React.FC = () => {
    const {id} = useParams();
    const {isInitialized, isLoading, chosen: group, error} = useSelector((state: any) => state.groups);

    const location = useLocation();
    const page = location.pathname.split("/").pop() || "";

    useEffect(() => {
        store.dispatch(getChosenGroup(id));
    }, [id]);

    if(isInitialized && !isLoading && group && !["admin", "rules", "privileges", "delete"].includes(page)) return(
        <div className="flex flex-1 justify-center pb-5 px-2">
            <div>
                <div className="relative">
                    <div className="w-full bg-image-wrapper border border-t-0 rounded-lg rounded-t-none">
                        <img
                            className="aspect-[12/4] w-[1200px] object-cover"
                            src={group.backgroundImage && fileUrl(group.backgroundImage)}
                            draggable={false}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2 py-2">
                    <div className="flex justify-between w-full">
                        <h1>
                            {group.name}
                        </h1>
                        <div className="flex gap-2 items-center">
                            {(permission(group?.privilages?.posting, group.myRole || null) && group.joined) ? (
                                <DestroyableDialog
                                    trigger={(
                                        <Button variant="outline" className="w-full">
                                            <Plus className="mr-2 h-4 w-4"/>
                                            Add post
                                        </Button>
                                    )}
                                    content={<PostForm group={group}/>}
                                />
                            ) : null}
                            {group.hidden ? (
                                <InviteToGroup group={group}/>
                            ) : null}
                            <GroupButton group={group}/>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <GroupTypeInfo group={group}/>
                        {group.members} Members
                    </div>
                </div>
                {(!group.private || group.joined) ? (
                    <>
                        <Tabs defaultValue={page == group._id ? "default" : page}>
                            <TabsList>
                                <TabsTrigger value="default" asChild>
                                    <Link to="">
                                        <AlignJustify className="mr-2 h-4 w-4"/>
                                        Discussion
                                    </Link>
                                </TabsTrigger>
                                <TabsTrigger value="gallery" asChild>
                                    <Link to="gallery">
                                        <LayoutGrid className="mr-2 h-4 w-4"/>
                                        Gallery
                                    </Link>
                                </TabsTrigger>
                                <TabsTrigger value="members" asChild>
                                    <Link to="members">
                                        <Users className="mr-2 h-4 w-4"/>
                                        Members
                                    </Link>
                                </TabsTrigger>
                                {(group.private
                                    && !group.hidden
                                    && permission(group?.privilages?.approving, group.myRole || null)
                                ) ? (
                                    <TabsTrigger value="group-requests" asChild>
                                        <Link to="group-requests">
                                            <Users className="mr-2 h-4 w-4"/>
                                            Requests
                                        </Link>
                                    </TabsTrigger>
                                ) : null}
                                <TabsTrigger value="about" asChild>
                                    <Link to="about">
                                        <Info className="mr-2 h-4 w-4"/>
                                        About
                                    </Link>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Separator/>
                        {["members", "group-requests"].includes(page) ? (
                            <Outlet
                                context={{
                                    choice: page,
                                    group:group,
                                    message: "No requests now"
                                }}
                                key={id+page}
                            />
                        ) : (
                            <Outlet
                                context={{
                                    choice: "group",
                                    group: group,
                                    message: "No posts yet"}}
                                key={id}
                            />
                        )}
                    </>
                ) : null}
            </div>
        </div>
    );
    else if(isLoading) {
        return <GroupLoadingPage/>
    }
    else if(error == 404) {
        return <GroupNotFound/>
    }
    //Group admin page
    else if(!isLoading) {
        return <Outlet context={{group: group}}/>
    }
}

export default GroupPage;