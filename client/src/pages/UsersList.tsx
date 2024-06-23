import {useOutletContext, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import React, {useEffect} from "react";
import store from "@/store";
import {getUsers, loadMoreUsers} from "@/store/slices/usersSlice.ts";
import InfiniteScroll from "react-infinite-scroll-component";
import ProfilesListElement from "@/components/user/ProfilesListElement.tsx";
import {Button} from "@/components/ui/button";



const UsersList: React.FC = () => {
    const {id, search} = useParams();
    const {choice, message}: any = useOutletContext();

    const users = useSelector((state: any) => state.users);

    const handleLoadMore = () => store.dispatch(loadMoreUsers({choice, id, search, index: 0}))

    useEffect(() => {
        store.dispatch(getUsers({choice, id, search, index: 0}));
    }, [id]);
    

    if(users.isListInitialized && users.list.length) {
        return(
            <InfiniteScroll
                hasMore={users.hasNext}
                dataLength={users.list.length || 0}
                next={handleLoadMore}
                loader={<h4>Loading...</h4>}
                className="flex flex-col gap-3.5 items-center"
            >
                {users.list.map((member: any) =>
                    <ProfilesListElement
                        profile={member}
                        showFollow={choice !== "group-requests"}
                        showGroupDropdown={choice === "members"}
                        showGroupAccept={choice === "group-requests"}
                    />
                )}
                {users.hasNext ? (
                    <Button 
                        variant="outline"
                        onClick={handleLoadMore}
                    >
                        Load more
                    </Button>
                ) : null}
            </InfiniteScroll>
        );
    }
    else if(users.isListInitialized) {
        return message;
    }
}

export default UsersList;