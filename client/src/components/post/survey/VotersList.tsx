import {DialogContent} from "@/components/ui/dialog";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import store from "@/store";
import {getUsers, loadMoreUsers} from "@/store/slices/usersSlice.ts";
import ProfilesListElement from "@/components/user/ProfilesListElement.tsx";
import {Button} from "@/components/ui/button.tsx";



interface VotersListProps {
    id: string;
    index: number;
}

const VotersList: React.FC<VotersListProps> = ({id, index}) => {
    const users = useSelector((state: any) => state.users);

    const handleLoadMore = () => {
        store.dispatch(loadMoreUsers({choice: "voters", id: id, index: index}))
    };

    useEffect(() => {
        store.dispatch(getUsers({choice: "voters", id: id, index: index}));
    }, []);

    return(
        <DialogContent>
            {users.isListInitialized && users.list.length ? (
                <>
                    {users.list.map((user: any) =>
                        <ProfilesListElement profile={user} showFollow/>
                    )}
                    {users.hasNext ? (
                        <Button
                            className="w-min"
                            variant="outline"
                            onClick={handleLoadMore}
                        >
                            Load more
                        </Button>
                    ) : null}
                </>
            ) : null}
        </DialogContent>
    );
}

export default VotersList;