import React from "react";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {MessageSquare, ThumbsUp} from "lucide-react";
import time from "@/functions/time.ts";
import {Button} from "@/components/ui/button.tsx";
import PostAuthor from "@/components/post/author/PostAuthor.tsx";
import PostDropdownMenu from "@/components/post/PostDropdownMenu.tsx";
import PostImages from "@/components/post/PostImages.tsx";
import PostSurvey from "@/components/post/survey/PostSurvey.tsx";
import {postsActions} from "@/store/slices/postsSlice.ts";
import store from "@/store";
import PostGroup from "@/components/post/author/PostGroup.tsx";
import DestroyableDialog from "@/components/DestroyableDialog.tsx";
import CommentsList from "@/components/post/comments/CommentsList.tsx";
import {Post} from "@/types";



interface PostCardProps {
    post: Post;
    hideGroup?: boolean
}

const PostCard: React.FC<PostCardProps> = ({post, hideGroup=false}) => {
    const handleLike = () => store.dispatch(postsActions.like(post._id));

    const likeClass = `icon ${post.isLiked && "fill-black dark:fill-white"}`;

    if(post) return(
        <Card className="max-w-[600px] w-full">
            <CardHeader>
                <div className="flex justify-between">
                    <div className="flex gap-4">
                        {(post.group && !hideGroup) ? (
                            <PostGroup user={post.user} group={post.group}/>
                        ) : (
                            <PostAuthor user={post.user}/>
                        )}
                    </div>
                    <div className="flex gap-3 items-center">
                        <span className="text-sm">
                            {time(post.time)}
                        </span>
                        <PostDropdownMenu post={post}/>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-0 flex flex-col gap-2.5">
                <pre className="px-3 text-left font-sans whitespace-pre-wrap">
                    {post.text}
                </pre>
                {post.images?.length ? (
                    <PostImages images={post.images}/>
                ) : post.survey ? (
                    <PostSurvey post={post}/>
                ) : null}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={handleLike}
                    >
                        <ThumbsUp className={likeClass}/>
                    </Button>
                    <DestroyableDialog
                        trigger={(
                            <Button
                                variant="outline"
                                size="icon"
                                className="w-8 h-8"
                            >
                                <MessageSquare className="icon"/>
                            </Button>
                        )}
                        content={(
                            <CommentsList id={post._id} autoFocus/>
                        )}
                    />
                </div>
                <div className="hidden 2xs:flex gap-2.5">
                    <span>
                        {post.likes || 0} Likes
                    </span>
                    <DestroyableDialog
                        trigger={(
                            <span className="hover:underline">
                                {post.comments || 0} Comments
                            </span>
                        )}
                        content={(
                            <CommentsList id={post._id}/>
                        )}
                    />
                </div>
            </CardFooter>
        </Card>
    );
}

export default PostCard;