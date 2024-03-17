import { createSlice } from "@reduxjs/toolkit";
import { retrieveAllTasks } from "../../services/userTasksService";
import { ONE } from "../../constants/appConstants";

const allTasksResponse = await retrieveAllTasks(ONE);
const initialState = {
    userTasks: allTasksResponse.data
}

const userTasksSlice = createSlice({
    name: "userTasks",
    initialState,
    reducers: {
        tasksFetchedByPage: (state, action) => {
            state.userTasks = [...state.userTasks, ...action.payload];
        },
        newTaskCreated: (state, action) => {
            state.userTasks = [...state.userTasks, action.payload];
        },
        taskUpdated: (state, action) => {
            state.userTasks = [...state.userTasks.map(task => task.id !== action.payload.id), action.payload];
        },
        taskDeleted: (state, action) => {
            state.userTasks = [...state.userTasks.map(task => task.id !== action.payload.id)];
        }
    }
});

export const { tasksFetchedByPage, newTaskCreated, taskUpdated, taskDeleted } = userTasksSlice.actions;
export default userTasksSlice.reducer;