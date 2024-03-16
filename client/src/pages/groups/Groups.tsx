import React, {useEffect} from "react";
import store from "@/store";
import {getGroups, loadMoreGroups} from "@/store/slices/groupsSlice.ts";
import {useSelector} from "react-redux";
import GroupCard from "@/components/group/GroupCard.tsx";
import GroupForm from "@/components/forms/GroupForm.tsx";
import InfiniteScroll from "react-infinite-scroll-component";
import {useParams} from "react-router-dom";



const Groups: React.FC<{choice?: string}> = ({choice}) => {
    document.title = "Groups - Social App";

    const {search} = useParams();
    const groups = useSelector((state: any) => state.groups);

    useEffect(() => {
        store.dispatch(getGroups({choice, search}));
    }, []);

    if(groups.isInitialized) return(
        <div className="flex flex-1 justify-center">
            <div className="flex flex-col gap-5 w-full mt-5">
                {groups.list.length ? (
                    <InfiniteScroll
                        hasMore={groups.hasNext}
                        dataLength={groups.list.length || 0}
                        next={() => store.dispatch(loadMoreGroups({choice, search}))}
                        loader={<h4>Loading...</h4>}
                        className="flex flex-wrap justify-center gap-2.5 py-5"
                    >
                        {groups.list.map((group: any) =>
                            <GroupCard group={group}/>
                        )}
                    </InfiniteScroll>
                ) : null}
                {!choice ? (
                    <GroupForm/>
                ) : null}
            </div>
        </div>
    );
}

export default Groups;