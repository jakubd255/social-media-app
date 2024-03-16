import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import server from "@/constants/server.ts";



const initialState = {
    list: [] as any[],
    page: 1 as number,
    hasNext: true as boolean,

    isLoading: false as boolean,
    isUploading: false as boolean,
    isInitialized: false as boolean,

    error: 0 as number
};



export const getComments = createAsyncThunk(
    "comments/getComments",
    async (id: string) => {
        const response = await server.get(`/comments/${id}`);
        return await response.data;
    }
);

export const loadMoreComments = createAsyncThunk(
    "comments/loadMore",
    async (id: string, thunkAPI) => {
        //@ts-ignore
        const page = thunkAPI.getState().comments.page || 1;

        const response = await server.get(`/comments/${id}`, {params: {page: page}});
        return await response.data;
    }
);

export const addComment = createAsyncThunk(
    "comments/addComment",
    async ({text, id}: any, thunkAPI) => {
        const comment = {
            text,
            postId: id,
            time: Math.floor(new Date().getTime()/1000)
        };

        const response = await server.post("/comments", {comment: comment});
        const data = await response.data;


        //@ts-ignore
        const user = thunkAPI.getState().auth.user;

        return {...comment, _id: data.id, user: user};
    }
)



const commentsSlice = createSlice({
    name: "comments",
    initialState,

    reducers: {
        reset: (state) => {
            state.list = [];
            state.page = 1;
            state.isInitialized = false;
        },

        remove: (state, {payload}) => {
            const id = payload;

            server.delete(`/comments/${id}`);

            state.list = state.list.filter(comment => comment._id !== id);
        }
    },

    extraReducers: (builder) => {
        //Load list of comments
        builder.addCase(getComments.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getComments.fulfilled, (state, {payload}) => {
            state.isInitialized = true;
            state.isLoading = false

            state.hasNext = payload.comments.length >= 10;

            state.page++;
            state.list = [...state.list, ...payload.comments];
        });
        builder.addCase(getComments.rejected, (state) => {
            state.isLoading = false
            state.error = 404;
        });

        //Load more comments
        builder.addCase(loadMoreComments.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(loadMoreComments.fulfilled, (state, {payload}) => {
            state.isLoading = false

            state.hasNext = payload.comments.length >= 10;

            state.page++;
            state.list = [...state.list, ...payload.comments];
        });
        builder.addCase(loadMoreComments.rejected, (state) => {
            state.isLoading = false
            state.error = 404;
        });

        //Add new comment
        builder.addCase(addComment.pending, (state) => {
            state.isUploading = true;
        });
        builder.addCase(addComment.fulfilled, (state, {payload}) => {
            state.isUploading = false;
            state.list = [payload, ...state.list];
        });
        builder.addCase(addComment.rejected, (state) => {
            state.isUploading = false;
        });
    }
});

export const commentsActions = commentsSlice.actions;
export default commentsSlice;