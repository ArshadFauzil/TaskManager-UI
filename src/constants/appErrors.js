import { MinDescriptionLength, MinTitleLength } from "./appConstants";

// API CALLS

export const TASK_CREATION_ERROR = 'An Error occurred when attempting to create a User Task in the server'
export const TASK_GET_ERROR = 'An Error occurred when attempting to retrieve User Task from the server'

//VALIDATION

export const MIN_TITLE_LENGTH_VALIDATION = 'Title must contain a minimum of ' + MinTitleLength + ' characters'
export const MIN_DESCRIPTION_LENGTH_VALIDATION = 'Description must contain a minimum of ' + MinDescriptionLength + ' characters'