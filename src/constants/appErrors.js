import { MinCommentLength, MinDescriptionLength, MinTitleLength } from "./appConstants";

// API CALLS

export const TASK_CREATION_ERROR = 'An Error occurred when attempting to create a User Task in the server'
export const TASK_UPDATE_ERROR = 'An Error occurred when attempting to update a User Task in the server'
export const TASK_DELETE_ERROR = 'An Error occurred when attempting to delete a User Task in the server'
export const TASK_GET_ERROR = 'An Error occurred when attempting to retrieve a User Task from the server'
export const COMMENTS_GET_ERROR = 'An Error occurred when attempting to retrieve User Task comments from the server'
export const COMMENT_GET_ERROR = 'An Error occurred when attempting to retrieve a User Task comment from the server'
export const COMMENT_CREATE_ERROR = 'An Error occurred when attempting to create a User Task comment in the server'
export const COMMENT_UPDATE_ERROR = 'An Error occurred when attempting to update a User Task comment in the server'
export const COMMENT_DELETE_ERROR = 'An Error occurred when attempting to delete a User Task comment in the server'


//VALIDATION

export const MIN_TITLE_LENGTH_VALIDATION = 'Title must contain a minimum of ' + MinTitleLength + ' characters'
export const MIN_DESCRIPTION_LENGTH_VALIDATION = 'Description must contain a minimum of ' + MinDescriptionLength + ' characters'
export const MIN_COMMENT_LENGTH_VALIDATION = 'Comment must contain a minimum of ' + MinCommentLength + ' characters'