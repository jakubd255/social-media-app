import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import server from "@/constants/server.ts";
import {Post} from "@/types";



const getUrl = (choice: string, id: string, search: string): string => {
    if(choice == "saved") {
        return "/posts/saved";
    }
    else if(choice == "profile") {
        return `/posts/user/${id}`;
    }
    else if(choice == "group") {
        return `/posts/group/${id}`;
    }
    else if(choice == "explore") {
        return `/posts/explore/${search || ""}`;
    }
    else {
        return "/posts/";
    }
};



const initialState = {
    list: [] as Post[],
    page: 1 as number,
    hasNext: true as boolean,

    isLoading: false as boolean,
    isUploading: false as boolean,
    isInitialized: false as boolean,

    error: 0 as number
};



export const getPosts = createAsyncThunk(
    "posts/getPosts",
    async ({choice, id, search}: any) => {
        const response = await server.get(getUrl(choice, id, search));

        return await response.data;
    }
);

export const loadMorePosts = createAsyncThunk(
    "/posts/loadMore",
    async ({choice, id, search}: any, thunkAPI) => {
        //@ts-ignore
        const page = thunkAPI.getState().posts.page || 1;

        const response = await server.get(getUrl(choice, id, search), {params: {page: page}});
        return await response.data;
    }
);

export const addPost = createAsyncThunk(
    "posts/addPost",
    async ({post, images}: any, thunkAPI) => {
        const formData = new FormData();
        formData.append("postData", JSON.stringify(post));

        for(let i=0; i<images.length; i++) {
            formData.append("images", images[i]);
        }

        const response = await server.post("/posts/", formData, {headers: {"Content-Type": "multipart/form-data"}});
        const data = await response.data;

        //@ts-ignore
        post.user = thunkAPI.getState().auth.user;
        post._id = data.postId;

        if(data.images) {
            post.images = data.images;
        }

        return post;
    }
);


const postsSlice = createSlice({
    name: "posts",
    initialState,

    reducers: {
        incrementComments: (state, {payload}) => {
            const {id, inc} = payload;

            state.list = state.list.map(post => {
                if(post._id === id) {
                    post.comments += inc;
                }
                return post;
            });
        },

        like: (state, action) => {
            const id = action.payload;

            server.put(`/posts/like/${id}`, {});

            state.list = state.list.map(post => {
                if(post._id === id) {
                    if(post.isLiked)
                        post.likes--;
                    else
                        post.likes++;

                    post.isLiked = !post.isLiked;
                }
                return post;
            });
        },

        save: (state, action) => {
            const id = action.payload;

            server.put(`/posts/save/${id}`, {});

            state.list = state.list.map(post => {
                if(post._id === id) {
                    post.isSaved = !post.isSaved;
                }
                return post;
            });
        },

        vote: (state, action) => {
            const {id, index}: {id: string, index: number} = action.payload;

            server.put(`/posts/vote/${id}`, {index: index});

            state.list = state.list.map(post => {
                if(post._id == id && post.survey)
                {
                    if(post.survey.myVote != null && post.survey.myVote != -1) {
                        post.survey.choices[post.survey.myVote].votes -= 1;
                    }
                    else {
                        post.survey.votesCount++;
                    }

                    post.survey.myVote = index;

                    post.survey.choices[index].votes += 1;
                }
                return post;
            });
        },

        addVoteOption: (state, action) => {
            const {id, option}: {id: string, option: string} = action.payload;

            server.put(`posts/vote/${id}/add`, {option: option});

            state.list = state.list.map(post => {
                if(post._id == id && post.survey)
                {
                    post.survey.choices.push({
                        text: option,
                        votes: 0
                    });
                }
                return post;
            });
        },

        remove: (state, action) => {
            const id = action.payload;

            server.delete(`/posts/${id}`);

            state.list = state.list.filter(post => post._id !== id);
        },
    },

    extraReducers: (builder) => {
        //Load list of posts
        builder.addCase(getPosts.pending, (state) => {
            state.isLoading = true;
            state.isInitialized = false;
        });
        builder.addCase(getPosts.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.list = payload.posts;

            state.hasNext = payload.posts.length >= 10;

            state.isInitialized = true;

            state.page = 2;
        });
        builder.addCase(getPosts.rejected, (state) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.error = 404;
        });

        //Load more posts
        builder.addCase(loadMorePosts.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(loadMorePosts.fulfilled, (state, {payload}) => {
            state.isLoading = false

            state.hasNext = payload.posts.length >= 10;
            
            state.page++;
            state.list = [...state.list, ...payload.posts];
        });
        builder.addCase(loadMorePosts.rejected, (state) => {
            state.isLoading = false
            state.error = 404;
        });

        //Add new post
        builder.addCase(addPost.pending, (state) => {
            state.isUploading = true;
        });
        builder.addCase(addPost.fulfilled, (state, {payload}) => {
            state.isUploading = false
            state.list = [payload, ...state.list];
        });
        builder.addCase(addPost.rejected, (state) => {
            state.isUploading = false
        });
    }
});

export const postsActions = postsSlice.actions;
export default postsSlice;