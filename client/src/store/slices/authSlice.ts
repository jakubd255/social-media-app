import {createSlice} from "@reduxjs/toolkit";
import server from "@/constants/server.ts";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null as any
    },

    reducers: {
        logIn: (state, action) => {
            state.user = action.payload;
        },

        logOut: (state) => {
            state.user = null;
            server.post("/auth/log-out", {});
        },

        updateAccount: (state, action) => {
            state.user = {...state.user, ...action.payload};
        },

        togglePrivate: (state) => {
            server.put("/users/", {private: !state.user.private});
            state.user.private = !state.user.private;
        }
    }
});

export const authActions = authSlice.actions;
export default authSlice;