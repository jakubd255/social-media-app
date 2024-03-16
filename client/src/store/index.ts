import {configureStore} from "@reduxjs/toolkit";
import authSlice from "@/store/slices/authSlice.ts";
import siderSlice from "@/store/slices/siderSlice.ts";
import groupsSlice from "@/store/slices/groupsSlice.ts";
import usersSlice from "@/store/slices/usersSlice.ts";
import postsSlice from "@/store/slices/postsSlice.ts";
import commentsSlice from "@/store/slices/commentsSlice.ts";



const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        sider: siderSlice.reducer,
        posts: postsSlice.reducer,
        users: usersSlice.reducer,
        groups: groupsSlice.reducer,
        comments: commentsSlice.reducer
    }
});

export default store;