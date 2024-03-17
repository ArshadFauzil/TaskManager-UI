import { combineReducers } from "redux";
import userTasksReducer from "../slices/userTasksSlice";

export default combineReducers({
    tasks: userTasksReducer
});