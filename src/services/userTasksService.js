import { getAllTasks, createTask, getTask } from "../api/taskAPI";

export const retrieveAllTasks = async (pageNumber) => {
    return await getAllTasks(pageNumber);
}

export const createUserTask = async (payload) => {
    return await createTask(payload);
}

export const getUserTaskById = async (id) => {
    return await getTask(id);
}