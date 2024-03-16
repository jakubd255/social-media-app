import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import server from "@/constants/server.ts";
import {Group} from "@/types";
import {usersActions} from "@/store/slices/usersSlice.ts";



const initialState = {
    list: [] as Group[],
    page: 1 as number,
    hasNext: true as boolean,

    chosen: null as any,

    isLoading: false as boolean,
    isUploading: false as boolean,
    isInitialized: false as boolean,

    error: 0 as number
};



const getUrl = (choice: string, search: string) => {
    if(choice == "explore") {
        return `/groups/explore/${search || ""}`;
    }
    else {
        return "/groups/";
    }
}



//Get groups
export const getGroups = createAsyncThunk(
    "groups/getGroups",
    async ({choice, search}: any) => {
        const response = await server.get(getUrl(choice, search));

        return await response.data;
    }
);

//Load more groups
export const loadMoreGroups = createAsyncThunk(
    "groups/loadMore",
    async ({choice, search}: any, thunkAPI) => {
        //@ts-ignore
        const page = thunkAPI.getState().groups.page || 1;

        const response = await server.get(getUrl(choice, search), {params: {page: page}});

        return await response.data;
    }
)

//Get chosen group
export const getChosenGroup = createAsyncThunk(
    "groups/getChosenGroup",
    async (id: string | undefined) => {
        const response = await server.get(`/groups/${id}`);

        return await  response.data;
    }
);

//Create new group
export const addGroup = createAsyncThunk(
    "groups/addGroup",
    async ({name, privacy, visibility}: any) => {
        const group = {name: name, private: (privacy == "private"), hidden: (visibility == "hidden")};

        const response = await server.post("/groups/", {group: group});

        const data = await response.data;

        return {...group, members: 1, _id: data.groupId, myRole: "author"};
    }
);

//Update chosen group
export const updateGroup = createAsyncThunk(
    "groups/updateGroup",
    async ({id, form, backgroundImage}: any) => {
        const formData = new FormData();
        formData.append("formData", JSON.stringify(form));

        if(backgroundImage?.selectedFiles) {
            formData.append("backgroundImage", backgroundImage.selectedFiles[0])
        }

        const response = await server.put(`/groups/${id}`, formData, {headers: {"Content-Type": "multipart/form-data"}});
        const data = await response.data;

        if(data.images.backgroundImage) {
            form.backgroundImage = data.images.backgroundImage;
        }

        return form;
    }
);


export const generateLink = createAsyncThunk(
    "groups/generateLink",
    async ({days, id}: any) => {
        const response = await server.post("/links", {days: days, groupId: id});
        await response.data;

        return response.data.link;
    }
);



const groupsSlice = createSlice({
    name: "grousp",
    initialState,

    reducers: {
        join: (state, {payload}) => {
            const id = payload;

            server.put(`/groups/join/${id}`);

            if(!state.chosen.private) {

                if(!state.chosen.joined) {
                    state.chosen.joined = true;
                    state.chosen.members++;
                }
                else {
                    state.chosen.joined = false;
                    state.chosen.members--;
                }
            }
            else {
                state.chosen.requested = !state.chosen.requested;
            }
        },

        removeLink: (state, {payload}) => {
            const id = payload;

            server.delete(`/links/${id}`);

            state.chosen.links = state.chosen.links.filter((link: any) => link._id !== id);
        },

        remove: (state) => {
            const id = state.chosen._id;

            server.delete(`/groups/${id}`);

            state.list = state.list.filter((group: Group) => group._id !== id);
        }
    },

    extraReducers: (builder) => {
        //Add group
        builder.addCase(addGroup.pending, (state) => {
            state.isUploading = true;
        });
        builder.addCase(addGroup.fulfilled, (state, {payload}) => {
            state.isUploading = false;
            //@ts-ignore
            state.list = [...state.list, payload];
        });
        builder.addCase(addGroup.rejected, (state) => {
            state.isUploading = false;
        });

        //Get list of groups
        builder.addCase(getGroups.pending, (state) => {
            state.isLoading = true;
            state.isInitialized = false;
        });
        builder.addCase(getGroups.fulfilled, (state, {payload}) => {
            state.list = payload.groups;
            state.isLoading = false;
            state.hasNext = payload.groups.length >= 10;
            state.isInitialized = true;
            state.page = 2;
        });
        builder.addCase(getGroups.rejected, (state) => {
            state.isLoading = false;
            state.isInitialized = true;
        });

        //Load more groups
        builder.addCase(loadMoreGroups.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(loadMoreGroups.fulfilled, (state, {payload}) => {
            state.list = [...state.list, payload.groups];
            state.isLoading = false;
            state.hasNext = payload.groups.length >= 10;
            state.page++;
        });
        builder.addCase(loadMoreGroups.rejected, (state) => {
            state.isLoading = false;
        });

        //Get chosen group
        builder.addCase(getChosenGroup.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getChosenGroup.fulfilled, (state, {payload}) => {
            state.chosen = payload.group;

            state.isLoading = false;
            state.isInitialized = true;

            document.title = `${payload.group.name} - Groups - Social App`;
        });
        builder.addCase(getChosenGroup.rejected, (state) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.error = 404;
        });

        //Update group
        builder.addCase(updateGroup.pending, (state) => {
            state.isUploading = true;
        });
        builder.addCase(updateGroup.fulfilled, (state, {payload}) => {
            state.chosen = {...state.chosen, ...payload};

            state.isUploading = false;

            if(payload.name) {
                document.title = `${payload.name} - Groups - Social App`;
            }
        });
        builder.addCase(updateGroup.rejected, (state) => {
            state.isUploading = false;
        });

        //Edit chosen group members count when member is accepted or removed
        builder.addCase(usersActions.removeFromGroup, (state) => {
           state.chosen.members--;
        });
        builder.addCase(usersActions.acceptToGroup, (state) => {
           state.chosen.members++;
        });

        //Generate new link for hidden group
        builder.addCase(generateLink.fulfilled, (state, {payload}) => {
            state.chosen.links = [...state.chosen.links, payload];
        });
    }
});

export const groupsActions = groupsSlice.actions;
export default groupsSlice;