import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Grid from "@mui/material/Grid";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import dayjs from 'dayjs';
import { newTaskCreated } from "../state/slices/userTasksSlice";
import { createUserTask, createUserTaskFile, getUserTaskById } from "../services/userTasksService";
import { formatDateToISOString } from "../util/appUtil";
import Alert from '@mui/material/Alert';
import { MaxTitleLength, MaxDescriptionLength, MinTitleLength, MinDescriptionLength } from "../constants/appConstants";
import { FILE_CREATE_ERROR, MIN_DESCRIPTION_LENGTH_VALIDATION, MIN_TITLE_LENGTH_VALIDATION, TASK_CREATION_ERROR, TASK_GET_ERROR } from "../constants/appErrors";
import { VIEW_TASK_ROUTE } from "../constants/routes";
import { Input } from '@mui/material';

const AddTask = ({ onAdd }) => {    

  const navigate = useNavigate();

  var initialDate = new Date();
  initialDate.setDate(initialDate.getDate() + 1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(initialDate);
  const [file, setFile] = useState(null);

  const [titleError, setTitleError] = useState(true);
  const [descriptionError, setDescriptionError] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(titleError || descriptionError);

  const [createApiErrorOccurred, setCreateApiErrorOccurred] = useState(false);
  const [getApiErrorOccurred, setGetApiErrorOccurred] = useState(false);
  const [createFileApiErrorOccurred, setCreateFileApiErrorOccurred] = useState(false);

  const dispatchToStore = useDispatch();

  useEffect(() => {
    const disableSubmission = titleError || descriptionError;
    setDisableSubmit(disableSubmission);
  }, [titleError, descriptionError, disableSubmit]);


  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    setTitleError(value.length < MinTitleLength);
  }

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    setDescriptionError(value.length < MinDescriptionLength);
  }

  const onSubmit = (e) => {
    e.preventDefault();

    const isoDateString = formatDateToISOString(dueDate);

    createUserTask({ title, description, dueDate: isoDateString })
        .then(creationResponse => {
            getUserTaskById(creationResponse.data)
                .then(getResponse => {
                    const newTask = getResponse.data;
                    dispatchToStore(newTaskCreated(newTask));

                    if (file) {
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('taskId', newTask.id);
                        formData.append('fileType', file.type);
                        createUserTaskFile(formData)
                            .then(fileCreationResponse => {
                                navigate(VIEW_TASK_ROUTE, { state: newTask });
                            })
                            .catch(error => {
                                setCreateFileApiErrorOccurred(true);
                            });
                    } else {
                        navigate(VIEW_TASK_ROUTE, { state: newTask });
                    }
                })
                .catch(error => {
                    setGetApiErrorOccurred(true);
                  });
        })
        .catch(error => {
            setCreateApiErrorOccurred(true);
          });
  }

  return (
    <Box
        component="form"
        noValidate
        autoComplete="off"
        className="add-form" 
        onSubmit={onSubmit}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography 
                        variant="h4" 
                        noWrap component="div"
                    >
                        Create Task
                    </Typography> 
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    id="outlined-basic" 
                    label="Title" 
                    variant="outlined" 
                    className="form-control"
                    placeholder="Add Title"
                    error={titleError}
                    helperText={titleError ? MIN_TITLE_LENGTH_VALIDATION : null}
                    inputProps={{ 
                        maxLength: MaxTitleLength
                    }}
                    value={title} 
                    onChange={handleTitleChange}
                />
                <span className="charLeft">
                    {MaxTitleLength - title.length} characters left
                </span>
                </Grid>
                <Grid item xs={12}>
                <TextField 
                    id="outlined-textarea"
                    label="Description"
                    rows={5}
                    placeholder="Add Description"
                    className="form-control"
                    multiline 
                    error={descriptionError}
                    helperText={descriptionError ? MIN_DESCRIPTION_LENGTH_VALIDATION : null}
                    value={description} 
                    inputProps={{ maxLength: MaxDescriptionLength }}
                    onChange={handleDescriptionChange}
                    />
                    <span className="charLeft">
                        {MaxDescriptionLength - description.length} characters left
                    </span>
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
                <Input 
                    type="file" 
                    label="file"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        endIcon={<SendIcon />}
                        disabled={disableSubmit}
                    >
                        Create Task
                    </Button>
                </Grid>
            </Grid>

            { createApiErrorOccurred ? <Alert severity="error">{TASK_CREATION_ERROR}</Alert> : null }
            { getApiErrorOccurred ? <Alert severity="error">{TASK_GET_ERROR}</Alert> : null }
            { createFileApiErrorOccurred ? <Alert severity="error">{FILE_CREATE_ERROR}</Alert> : null }
        </Box>
  )
}

export default AddTask
