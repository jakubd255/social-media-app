import React from "react";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import initials from "@/functions/initials.ts";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import time from "@/functions/time.ts";
import {Trash2} from "lucide-react";
import store from "@/store";
import {commentsActions} from "@/store/slices/commentsSlice.ts";
import {postsActions} from "@/store/slices/postsSlice.ts";
import {Comment, Post} from "@/types";
import {canDeleteComment} from "@/functions/permission.ts";
import {useSelector} from "react-redux";
import imageUrl from "@/functions/imageUrl";



const CommentCard: React.FC<{comment: Comment}> = ({comment}) => {
    const user = useSelector((state: any) => state.auth.user);
    const post = useSelector((state: any) => state.posts.list.find((p: Post) => p._id === comment.postId));

    const handleDelete = () => {
        store.dispatch(commentsActions.remove(comment._id));
        store.dispatch(postsActions.incrementComments({id: comment.postId, inc: -1}));
    }

    return(
        <Card className="border-0">
            <CardContent className="flex justify-between p-1">
                <div className="flex gap-2">
                    <Avatar>
                        <AvatarFallback>
                            {initials(comment.user.fullname)}
                        </AvatarFallback>
                        <AvatarImage src={comment.user.profileImage && imageUrl(comment.user.profileImage)}/>
                    </Avatar>
                    <div className="flex flex-col">
                        <div className="flex gap-4">
                            <Button
                                variant="link"
                                className="p-0 w-min h-min"
                                asChild
                            >
                                <Link to={`/profile/${comment.user._id}`}>
                                    {comment.user.fullname}
                                </Link>
                            </Button>
                            <span className="text-sm">
                                {time(comment.time)}
                            </span>
                        </div>
                        <span>
                            {comment.text}
                        </span>
                    </div>
                </div>
                {canDeleteComment(user, post, comment) ? (
                    <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-4 h-4"/>
                    </Button>
                ) : null}
            </CardContent>
        </Card>
    );
}

export default CommentCard;