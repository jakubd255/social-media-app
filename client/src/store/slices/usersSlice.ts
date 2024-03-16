import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import server from "@/constants/server.ts";
import {User} from "@/types";
import {authActions} from "@/store/slices/authSlice.ts";



const getUrl = (choice: string, id: string, search: string, index: number = 0) => {
    if(choice == "followers") {
        return `/users/${id}/followers`
    }
    else if(choice == "following") {
        return `/users/${id}/following`
    }
    else if(choice == "follow-requests") {
        return `/users/${id}/requests`
    }
    else if(choice == "voters") {
        return `/posts/${id}/voters/${index}` 
    }
    else if(choice == "members") {
        return `/groups/${id}/members`;
    }
    else if(choice == "group-requests") {
        return `/groups/${id}/requests`;
    }
    else if(choice == "likes") {
        return `/posts/${id}/likes`;
    }
    else {
        return `/users/explore/${search || ""}`;
    }
}



const initialState = {
    profile: null as any,

    list: [] as User[],
    page: 1 as number,
    hasNext: true as boolean,

    isLoading: false as boolean,
    isUploading: false as boolean,
    isInitialized: false as boolean,

    isListLoading: false as boolean,
    isListInitialized: false as boolean,

    error: 0 as number,
};



//Get chosen profile
export const getProfile = createAsyncThunk(
    "users/getProfile",
    async (id: string | undefined) => {
        const response = await server.get(`/users/${id}`);

        return await response.data;
    },
);

//Update your profile
export const updateProfile = createAsyncThunk(
    "users/updateProfile",
    async (form: any, {dispatch}) => {
        const formData = new FormData();
        formData.append("formData", JSON.stringify(form));

        if(form.profileImage) {
            formData.append("profileImage", form.profileImage)
        }
        if(form.backgroundImage) {
            formData.append("backgroundImage", form.backgroundImage)
        }

        delete form.profileImage;
        delete form.backgroundImage;

        const response = await server.put("/users/", formData, {headers: {"Content-Type": "multipart/form-data"}});

        const data = await response.data;

        if(data.images.profileImage) {
            form.profileImage = data.images.profileImage;
        }
        if(data.images.backgroundImage) {
            form.backgroundImage = data.images.backgroundImage;
        }

        dispatch(authActions.updateAccount(form));

        return form;
    }
);

//Get users list
export const getUsers = createAsyncThunk(
    "users/getUsers",
    async ({choice, id, search, index}: any) => {
        const response = await server.get(getUrl(choice, id, search, index));

        return await response.data;
    }
);

//Load more users
export const loadMoreUsers = createAsyncThunk(
    "users/loadMore",
    async ({choice, id, search, index}: any, thunkAPI) => {
        //@ts-ignore
        const page = thunkAPI.getState().users.page || 1;

        const response = await server.get(getUrl(choice, id, search, index), {params: {page: page}});
        return await response.data;
    }
);



const usersSlice = createSlice({
    name: "users",
    initialState,

    reducers: {
        reset: (state) => {
            state.profile = null;
            state.list = [];
        },

        //Follow chosen user
        follow: (state, {payload}) => {
            const {id, myId} = payload;

            server.put(`/users/${id}/follow`, {});

            const chosenUser: User = state.profile?._id == id ? state.profile : state.list.find((user) => user._id == id);

            console.log(chosenUser);

            if(chosenUser.isFollowed) {
                chosenUser.isFollowed = false;
                chosenUser.followers--;

                if(state.profile?._id == myId) {
                    state.profile.following--;
                }
            }
            else if(chosenUser.private) {
                chosenUser.isRequested = !chosenUser.isRequested;
            }
            else {
                chosenUser.isFollowed = true;
                chosenUser.followers++;

                if(state.profile?._id == myId) {
                    state.profile.following++;
                }
            }
        },

        //Accept follow request - when your account is private
        acceptFollow: (state, {payload}) => {
            const {id, isAccepted} = payload;

            server.put(`/users/${id}/accept`, {choice: isAccepted});

            const chosenUser: User = state.profile ? state.profile : state.list.find((user) => user._id == id);

            if(isAccepted) {
                chosenUser.followers++;
                chosenUser.followingMe = true;
                chosenUser.requestedMe = false;
            }
            else {
                chosenUser.requestedMe = false;
            }

            state.list = state.list.filter(user => user._id !== id);
        },

        //Accept user request to group
        acceptToGroup: (state, {payload}) => {
            const {id, groupId, isAccepted} = payload;

            // @ts-ignore
            const chosenUser: User = state.list.find(user => user._id == id);

            if(chosenUser) {
                state.list = state.list.filter((user) => user._id !== id);
                server.put(`/groups/${groupId}/${id}/accept`, { choice: isAccepted });
            }
        },

        //Remove user from group
        removeFromGroup: (state, {payload}) => {
            const {id, groupId} = payload;

            server.put(`/groups/${groupId}/${id}/remove`, {});
            state.list = state.list.filter((user) => user._id !== id);
        },

        //Set user role in group
        setRole: (state, {payload}) => {
            const {id, groupId, role} = payload;

            server.put(`/groups/${groupId}/${id}/change-role`, {role: role});

            state.list = state.list.map((user) => {
                if(user._id == id) {
                    user.role = role;
                }
                return user;
            });
        },
    },

    extraReducers: (builder) => {
        //Get chosen user profile
        builder.addCase(getProfile.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getProfile.fulfilled, (state, {payload}) => {
            state.isInitialized = true;
            state.isLoading = false;
            state.profile = payload.user;

            document.title = `${payload.user.fullname} (@${payload.user.username}) - Social App`;
        });
        builder.addCase(getProfile.rejected, (state) => {
            state.isInitialized = true;
            state.isLoading = false;
            state.error = 404;
        });

        //Update your profile
        builder.addCase(updateProfile.pending, (state) => {
            state.isUploading = true;
        });
        builder.addCase(updateProfile.fulfilled, (state, {payload}) => {
            state.isUploading = false;
            state.profile = {...state.profile, ...payload};
        });
        builder.addCase(updateProfile.rejected, (state) => {
            state.isUploading = false;
        });

        //Get list of users
        builder.addCase(getUsers.pending, (state) => {
            state.isListLoading = true;
            state.isListInitialized = false;
        });
        builder.addCase(getUsers.fulfilled, (state, {payload}) => {
            state.isListLoading = false
            state.list = payload.users;

            state.hasNext = payload.users.length >= 10;

            state.isListInitialized = true;

            state.page = 2;
        });
        builder.addCase(getUsers.rejected, (state) => {
            state.isListLoading = false;
            state.isListInitialized = true;
            state.error = 404;
        });

        //Load more users
        builder.addCase(loadMoreUsers.pending, (state) => {
            state.isListLoading = true;
        });
        builder.addCase(loadMoreUsers.fulfilled, (state, {payload}) => {
            state.isListLoading = false

            state.hasNext = payload.users.length >= 10;

            state.page++;
            state.list = [...state.list, ...payload.users];
        });
        builder.addCase(loadMoreUsers.rejected, (state) => {
            state.isLoading = false
            state.error = 404;
        });
    },
});

export const usersActions = usersSlice.actions;
export default usersSlice;