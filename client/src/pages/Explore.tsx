import React from "react";
import {Link, Outlet, useParams} from "react-router-dom";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";



const Explore: React.FC = () => {
    document.title = "Explore - SocialApp";

    const {search} = useParams();

    const isPosts: boolean = location.pathname.includes("posts");
    const isUsers: boolean = location.pathname.includes("users");
    const isGroups: boolean = location.pathname.includes("groups");

    const page = isPosts ? "posts" : isUsers ? "users" : isGroups ? "groups" : "";

    return(
        <div className="flex flex-1 justify-center">
            <div className="flex flex-col gap-5 w-full">
                <div className="flex justify-center sticky top-[60px] z-40">
                    <Tabs defaultValue={page}>
                        <TabsList>
                            <TabsTrigger value="posts" asChild>
                                <Link to={`/explore/posts${search ? "/"+search : ""}`}>
                                    Posts
                                </Link>
                            </TabsTrigger>
                            <TabsTrigger value="users" asChild>
                                <Link to={`/explore/users${search ? "/"+search : ""}`}>
                                    Users
                                </Link>
                            </TabsTrigger>
                            <TabsTrigger value="groups" asChild>
                                <Link to={`/explore/groups${search ? "/"+search : ""}`}>
                                    Groups
                                </Link>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <Outlet
                    context={{
                        choice: "explore",
                        message: "There's no posts to explore yet"
                    }}
                />
            </div>
        </div>
    );
}

export default Explore;