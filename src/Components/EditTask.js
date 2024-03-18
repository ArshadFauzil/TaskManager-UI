import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import SendIcon from '@mui/icons-material/Send';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import { updateUserTask } from "../services/userTasksService";
import { formatDateToISOString } from "../util/appUtil";
import Alert from '@mui/material/Alert';
import { MaxTitleLength, MaxDescriptionLength, MinTitleLength, MinDescriptionLength } from "../constants/appConstants";
import { MIN_DESCRIPTION_LENGTH_VALIDATION, MIN_TITLE_LENGTH_VALIDATION, TASK_UPDATE_ERROR } from "../constants/appErrors";
import { VIEW_TASK_ROUTE } from "../constants/routes";
import UserTaskStatuses from "../constants/userTaskStatuses";
import { taskUpdated } from "../state/slices/userTasksSlice";


const EditTask = () => {
    const location = useLocation();
    const task = location.state;

    const dispatchToStore = useDispatch();

    const navigate = useNavigate();

    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [dueDate, setDueDate] = useState(new Date(task.dueDate));
    const [status, setStatus] = useState(task.status);

    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(titleError || descriptionError);

    const [updateApiErrorOccurred, setUpdateApiErrorOccurred] = useState(false);

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
        const statusString = status ? UserTaskStatuses.COMPLETE : UserTaskStatuses.INCOMPLETE;

        const payload = { title, description, status: statusString, dueDate: isoDateString };
    
        updateUserTask(task.id, payload)
            .then(updateResponse => {
                const updatedTask = {...payload, id: task.id };
                dispatchToStore(taskUpdated(updatedTask));
                navigate(VIEW_TASK_ROUTE, { state: updatedTask });
            })
            .catch(function (error) {
                setUpdateApiErrorOccurred(true);
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
                        Edit Task
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
                        inputProps={{ maxLength: MaxTitleLength }}
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
                    <FormControlLabel 
                        control={<Checkbox defaultChecked={ task.status === UserTaskStatuses.COMPLETE } />} 
                        label="Task Complete" 
                        value={status}
                        className="form-control" 
                        onChange={(e) => setStatus(e.target.checked)}
                    />
                </Grid>
                <Grid item xs={1.5}>
                    <Button 
                        type="submit" 
                        variant="outlined" 
                        color="error"
                        className="form-control" 
                        endIcon={<CancelIcon />}
                        onClick={() => {navigate(VIEW_TASK_ROUTE, { state: task })}}
                    >
                        Cancel
                    </Button>
                </Grid>
                <Grid item xs={9.5}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        className="form-control" 
                        endIcon={<SendIcon />}
                        disabled={disableSubmit}
                    >
                        Update Task
                    </Button>
                </Grid>
            </Grid>
    
                { updateApiErrorOccurred ? <Alert severity="error">{TASK_UPDATE_ERROR}</Alert> : null }
        </Box>
      )
      
};

export default EditTask;