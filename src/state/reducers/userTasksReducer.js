import { getAllTasks } from '../../api/taskAPI'
import * as actions from '../actions/actionTypes'

const getInitialState = async () => {
    return await getAllTasks();
}



const userTasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.TASKS_FETCHED_BY_PAGE: 
            return {
                userTasks: [...state.userTasks, ...action.payload]
            };
        case actions.NEW_TASK_CREATED:
            return {
                userTasks: [...state.userTasks, action.payload]
            };
        case actions.TASK_UPDATED:
            return {
                userTasks: [...state.userTasks.map(task => task.id !== action.payload.id), action.payload]
            };
        case actions.TASK_DELETED:
            return {
                userTasks: [...state.userTasks.map(task => task.id !== action.payload)]
            };
        default:
            return state;

    }
}

export default userTasksReducer;