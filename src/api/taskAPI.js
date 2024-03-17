import API from './api';

// TASKS

export async function createTask (payload) {
    return await API.post('tasks/', payload);
}

export async function getAllTasks (pageNumber) {
    return await API.get(`tasks?pageNumber=${pageNumber}`);
}

export async function getTask (taskId) {
    return await API.get(`tasks/${taskId}`);
}

export async function updateTask (taskId, payload) {
    return await API.put(`tasks/${taskId}`, payload);
}

export async function deleteTask (taskId) {
    return await API.delete(`tasks/${taskId}`);
}

// COMMENTS

export async function createTaskComment (payload) {
    return await API.post('tasks/comments', payload);
}

export async function getCommentForTasks (taskId) {
    return await API.get(`tasks/${taskId}/comments`);
}

export async function getComment(commentId) {
    return await API.get(`tasks/comments/${commentId}`);
}

export async function updateTaskComment (commentId, payload) {
    return await API.put(`tasks/comments/${commentId}`, payload);
}

export async function deleteTaskComment (commentId) {
    return await API.delete(`tasks/comments/${commentId}`);
}
