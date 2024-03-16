import {createSlice} from "@reduxjs/toolkit";

const siderSlice = createSlice({
    name: "sider",
    initialState: {
        isOpen: true as boolean
    },

    reducers: {
        toggleOpen: (state) => {
            state.isOpen = !state.isOpen;
        }
    }
});

export const siderActions = siderSlice.actions;
export default siderSlice;

