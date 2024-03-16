import React, {useEffect} from "react";
import {useOutletContext, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {getPosts, loadMorePosts} from "@/store/slices/postsSlice.ts";
import store from "@/store";
import {Post} from "@/types";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "@/components/post/PostCard.tsx";



const Posts: React.FC = () => {
    const {id, search} = useParams() || null;
    const {choice, message}: any = useOutletContext();

    const posts = useSelector((state: any) => state.posts);

    useEffect(() => {
        store.dispatch(getPosts({choice, id, search}));
    }, [search]);

    if(posts.isInitialized && posts?.list.length) {
        return(
            <InfiniteScroll
                hasMore={posts.hasNext}
                dataLength={posts.list.length || 0}
                next={() => store.dispatch(loadMorePosts({choice, id, search}))}
                loader={<h4>Loading...</h4>}
                className="flex flex-col items-center gap-5 my-5"
            >
                {posts.list.map((post: Post) =>
                    <PostCard
                        post={post}
                        key={post._id}
                        hideGroup={choice == "group"}
                    />
                )}
            </InfiniteScroll>
        );
    }

    else if(posts.isInitialized && !posts.hasMore && message) {
        return (
            <span className="mt-5 text-center">
                {message}
            </span>
        );
    }
}

export default Posts;