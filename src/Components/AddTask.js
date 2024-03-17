import { useState } from "react"
import { useDispatch } from "react-redux"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LinearProgress from "@mui/material/LinearProgress";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import dayjs from 'dayjs';
import { newTaskCreated } from "../state/slices/userTasksSlice";
import { createUserTask, getUserTaskById } from "../services/userTasksService";
import { formatDateToISOString } from "../util/appUtil";
import Alert from '@mui/material/Alert';
import { MaxTitleLength, MaxDescriptionLength, MinTitleLength, MinDescriptionLength } from "../constants/appConstants";
import { MIN_DESCRIPTION_LENGTH_VALIDATION, MIN_TITLE_LENGTH_VALIDATION, TASK_CREATION_ERROR, TASK_GET_ERROR } from "../constants/appErrors";


const AddTask = ({ onAdd }) => {    

  var initialDate = new Date();
  initialDate.setDate(initialDate.getDate() + 1);
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState(initialDate)

  const [titleError, setTitleError] = useState(true)
  const [descriptionError, setDescriptionError] = useState(true)
  const [disableSubmit, setDisableSubmit] = useState(titleError || descriptionError)

  const [createApiErrorOccurred, setCreateApiErrorOccurred] = useState(false)
  const [getApiErrorOccurred, setGetApiErrorOccurred] = useState(false)

  const dispatchToStore = useDispatch();

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    console.log('title length ', value.length);
    console.log('MinTitleLength ', MinTitleLength);
    const fieldError = value.length < MinTitleLength;
    setTitleError(fieldError);
    const disableSubmission = titleError || descriptionError;
    setDisableSubmit(disableSubmission);
    console.log('title error ', titleError);
    console.log('desc error ', descriptionError);
    console.log('disable bttn', disableSubmission);
  }

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    console.log('desc length ', value.length);
    console.log('MinDescriptionLength error ', MinDescriptionLength);
    const fieldError = value.length < MinDescriptionLength;
    setDescriptionError(fieldError);
    const disableSubmission = titleError || descriptionError;
    setDisableSubmit(disableSubmission);
    console.log('title error ', titleError);
    console.log('desc error ', descriptionError);
    console.log('disable bttn', disableSubmission);
  }

  const onSubmit = (e) => {
    e.preventDefault()

    const isoDateString = formatDateToISOString(dueDate)

    createUserTask({ title, description, dueDate: isoDateString })
        .then(creationResponse => {
            console.log(creationResponse.data)
            getUserTaskById(creationResponse.data)
                .then(getResponse => {
                    console.log(getResponse.data)
                    dispatchToStore(newTaskCreated(getResponse.data))
                })
                .catch(function (error) {
                    setGetApiErrorOccurred(true);
                    console.log(error);
                  });
        })
        .catch(function (error) {
            setCreateApiErrorOccurred(true);
            console.log(error);
          });

    console.log(title, description, dueDate)

    setTitle('')
    setDescription('')
    setDueDate('')
  }

  return (
    <Box
        component="form"
        sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        className="add-form" 
        onSubmit={onSubmit}
        >
        <TextField 
            id="outlined-basic" 
            label="Title" 
            variant="outlined" 
            className="form-control"
            placeholder="Add Title"
            error={titleError}
            helperText={titleError ? MIN_TITLE_LENGTH_VALIDATION : null}
            inputProps={{ maxLength: {MaxTitleLength} }}
            value={title} 
            onChange={handleTitleChange}
        />
        <span className="charLeft">
            {MaxTitleLength - title.length} characters left
        </span>
        <LinearProgress
            className="charProgress"
            variant="determinate"
            value={title.length}
        />
        <TextField 
            id="outlined-textarea"
            label="Description"
            rows={5}
            placeholder="Add Description"
            className="form-control"ß
            multiline 
            error={descriptionError}
            helperText={descriptionError ? MIN_DESCRIPTION_LENGTH_VALIDATION : null}
            value={description} 
            inputProps={{ maxLength: {MaxDescriptionLength} }}
            onChange={handleDescriptionChange}
            />
            <span className="charLeft">
                {MaxDescriptionLength - description.length} characters left
            </span>
            <LinearProgress
                className="charProgress"
                variant="determinate"
                value={description.length}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker 
                    label="Due Date" 
                    className="form-control" 
                    placeholder="Add Due Date"
                    value={dayjs(dueDate)} 
                    onChange={(e) => setDueDate(e)}
                    disablePast
                />
            </LocalizationProvider>
            <Button 
                type="submit" 
                variant="contained" 
                endIcon={<SendIcon />}
                disabled={disableSubmit}
            >
                Create Task
            </Button>

            { createApiErrorOccurred ? <Alert severity="error">{TASK_CREATION_ERROR}</Alert> : null }
            { getApiErrorOccurred ? <Alert severity="error">{TASK_GET_ERROR}</Alert> : null }
        </Box>
  )
}

export default AddTask
