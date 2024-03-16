import {DialogContent, DialogHeader } from "@/components/ui/dialog";
import React, {useEffect} from "react";
import CommentForm from "@/components/forms/CommentForm.tsx";
import {useSelector} from "react-redux";
import store from "@/store";
import {commentsActions, getComments, loadMoreComments} from "@/store/slices/commentsSlice.ts";
import CommentCard from "@/components/post/comments/CommentCard.tsx";
import {Button} from "@/components/ui/button.tsx";



interface CommentsListProps {
    autoFocus?: boolean;
    id: string
}

const CommentsList: React.FC<CommentsListProps> = ({id, autoFocus}) => {
    const comments = useSelector((state: any) => state.comments);

    const handleLoadMore = () => {
        store.dispatch(loadMoreComments(id));
    }

    useEffect(() => {
        store.dispatch(getComments(id));

        return () => {
            store.dispatch(commentsActions.reset());
        }
    }, []);

    return(
        <DialogContent className="px-0 max-w-[1000px]">
            <DialogHeader className="px-3">
                Comments
            </DialogHeader>
            {comments.isInitialized ? (
                <div className="flex flex-col gap-2 overflow-y-scroll h-full max-h-[80vh]">
                    <CommentForm 
                        id={id} 
                        autoFocus={autoFocus}
                    />
                    <div className="flex flex-col gap-4 justify-start p-1">
                        {comments.list.map((comment: any) =>
                            <CommentCard comment={comment}/>
                        )}
                    </div>
                    {comments.hasNext ? (
                        <Button 
                            variant="outline" 
                            onClick={handleLoadMore}
                        >
                            Load more
                        </Button>
                    ) : null}
                </div>
            ) : (
                <span className="text-center">
                    Loading
                </span>
            )}
        </DialogContent>
    );
}

export default CommentsList;