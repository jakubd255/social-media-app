import InfiniteScroll from "react-infinite-scroll-component";
import React, {useEffect} from "react";
import {useOutletContext, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import store from "@/store";
import {getPosts, loadMorePosts} from "@/store/slices/postsSlice.ts";
import {Post} from "@/types";
import Masonry from "react-masonry-css";
import checkFileType from "@/functions/checkFileType";
import {videoUrl, fileUrl} from "@/functions/fileUrl";



const ImageGallery: React.FC = () => {
    const {id} = useParams() || null;
    const {choice}: any = useOutletContext();

    const posts = useSelector((state: any) => state.posts);
    const length = posts.list.filter((post: Post) => post.files?.length).length;

    useEffect(() => {
        store.dispatch(getPosts({choice, id}));
    }, []);

    if(posts.isInitialized && length) {
        return (
            <InfiniteScroll
                hasMore={posts.hasNext}
                dataLength={posts.list.length || 0}
                next={() => store.dispatch(loadMorePosts({choice, id}))}
                loader={null}
                className="max-w-[1200px]"
            >
                {posts?.list.length ? (
                    <Masonry
                        breakpointCols={{default: 3, 1100: 2, 700: 1, 500: 1}}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {posts.list.map((post: Post) => {
                            const images = post.files?.filter(file => ["video", "image"].includes(checkFileType(file))) as string[];

                            return images.map((image: string, index: number) => (
                                <div key={index} className="masonry-item">
                                    {checkFileType(image) === "image" ? (
                                        <img
                                            src={fileUrl(image)}
                                            className="rounded-lg border-2"
                                            draggable={false}
                                        />
                                    ) : checkFileType(image) === "video" ? (
                                        <video
                                            src={videoUrl(image)}
                                            className="rounded-lg border-2"
                                            draggable={false}
                                            controls
                                        />
                                    ) : null}
                                </div>
                            ));
                        })}
                    </Masonry>
                ) : null}
            </InfiniteScroll>
        );
    }

    else if(posts.isInitialized && !posts.hasMore) {
        return "There are no images yet";
    }
}

export default ImageGallery;