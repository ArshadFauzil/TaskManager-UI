import { getAllTasks, createTask, getTask, updateTask, deleteTask, getCommentForTasks, updateTaskComment, createTaskComment, getComment, deleteTaskComment, createTaskFile } from "../api/taskAPI";
import UserTaskStatuses from "../constants/userTaskStatuses";
import { formatDateToISOString } from "../util/appUtil";
import moment from "moment";

export const retrieveAllTasks = async (pageNumber) => {
    return await getAllTasks(pageNumber);
}

export const createUserTask = async (payload) => {
    return await createTask(payload);
}

export const updateUserTask = async (id, payload) => {
    return await updateTask(id, payload);
}

export const deleteUserTask = async (id) => {
    return await deleteTask(id);
}

export const getUserTaskById = async (id) => {
    return await getTask(id);
}

export const retrieveAllCommentsForTasks = async (taskId) => {
    return await getCommentForTasks(taskId);
}

export const createUserTaskComment = async (payload) => {
    return await createTaskComment(payload);
}

export const getCommentById = async (commentId) => {
    return await getComment(commentId);
}

export const createUserTaskFile = async (payload) => {
    return await createTaskFile(payload);
}

export const updateUserTaskComment = async (id, payload) => {
    return await updateTaskComment(id, payload);
}

export const deleteUserTaskComment = async(commentId) => {
    return await deleteTaskComment(commentId);
}

export const checkIfUserTaskStatusIsCompleted = (status) => {
    return status === UserTaskStatuses.COMPLETE;
}

export const filterUserTasks = (searchQuery, dateQuery, userTasks) => {
    const upperCaseQuery = searchQuery.toUpperCase();
    var isoDateQuery = "";

    if (dateQuery) {
        isoDateQuery = formatDateToISOString(dateQuery);
    }

    return userTasks.filter((task) => {
        const upperCaseTitle = task.title.toUpperCase();
        if (upperCaseQuery) {
            if (dateQuery) {
                return upperCaseTitle.includes(upperCaseQuery) && 
                            moment(isoDateQuery).isSame(task.dueDate, 'day');
            } else {
                return upperCaseTitle.includes(upperCaseQuery);
            }
        } else if (dateQuery) {
            return moment(isoDateQuery).isSame(task.dueDate,  'day');
        } else {
            return true;
        }
      });
  }

  export const sortUserTasksByLatestDueDates = (tasks) => {
    return [].slice.call(tasks).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)).reverse();
  }