import { useState } from 'react';
import { useDispatch } from "react-redux";
import { formatDateString } from '../util/appUtil'
import { appDateFormat } from '../constants/appConstants'
import UserTaskStatuses from '../constants/userTaskStatuses'
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { VIEW_TASK_ROUTE, ROOT_ROUTE } from '../constants/routes';
import { TASK_DELETE_ERROR, TASK_UPDATE_ERROR } from "../constants/appErrors";
import { DELETE_TASK_CONFIRM_MESSAGE, STATUS_COMPLETE_UPDATE_CONFIRM_MESSAGE, STATUS_INCOMPLETE_UPDATE_CONFIRM_MESSAGE } from "../constants/confirmationMessages";
import ConfirmationDialogBox from './commonComponents/ConfirmationDialogBox';
import { checkIfUserTaskStatusIsCompleted, deleteUserTask } from '../services/userTasksService';
import { taskDeleted, taskUpdated } from "../state/slices/userTasksSlice";
import { updateUserTask } from "../services/userTasksService";

const Task = ({ task }) => {

  const [taskStatusIsComplete, setTaskStatusIsComplete] = 
      useState(checkIfUserTaskStatusIsCompleted(task.status));

  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const [openSetStatusConfirmDialog, setOpenSetStatusConfirmDialog] = useState(false);

  const [deletApiErrorOccurred, setDeletApiErrorOccurred] = useState(false);
  const [updateApiErrorOccurred, setUpdateApiErrorOccurred] = useState(false);

  const dispatchToStore = useDispatch();

  const navigate = useNavigate();
  const handleDoubleClick = () => navigate(VIEW_TASK_ROUTE, { state: task });

  const handleDeleteConfirmDialogOpen = () => {
    setOpenDeleteConfirmDialog(true);
  };

  const handleDeleteConfirmDialogClose = () => {
    setOpenDeleteConfirmDialog(false);
  };

  const handleSetCompleteConfirmDialogOpen = () => {
    setOpenSetStatusConfirmDialog(true);
  };

  const handleSetCompleteConfirmDialogClose = () => {
    setOpenSetStatusConfirmDialog(false);
  };

  const handleDeleteConfirm = () => {
    setOpenDeleteConfirmDialog(false);
    deleteUserTask(task.id)
      .then(deleteResponse => {
        dispatchToStore(taskDeleted(task));
        navigate(ROOT_ROUTE);
      })
      .catch(function (error) {
        setDeletApiErrorOccurred(true);
      });
  };

  const handleSetStatusConfirm = () => {
    setOpenSetStatusConfirmDialog(false);
    const payload = { ...task, status: ( checkIfUserTaskStatusIsCompleted(task.status) ? 
      UserTaskStatuses.INCOMPLETE : UserTaskStatuses.COMPLETE) };
    updateUserTask(task.id, payload)
        .then(updateResponse => {
            dispatchToStore(taskUpdated(payload));
            setTaskStatusIsComplete(!taskStatusIsComplete);
            //navigate(ROOT_ROUTE);
        })
        .catch(function (error) {
            setUpdateApiErrorOccurred(true);
        });
  };

  return (
    <div>
      <Card variant="outlined" className="task" onDoubleClick={handleDoubleClick}>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography gutterBottom variant="h5" component="div">
              {task.title}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              {formatDateString(task.dueDate, appDateFormat)}
            </Typography>
          </Stack>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography color={`${checkIfUserTaskStatusIsCompleted(task.status) ? 'green' : 'red' }`} gutterBottom variant="h5" component="div">
              {task.status}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              <Button 
                variant="contained" 
                onClick={handleSetCompleteConfirmDialogOpen}
              >
                {!taskStatusIsComplete ? 'Set Task To Complete' : 'Set Task To Incomplete'}
              </Button>
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              <Button 
                variant="contained" 
                color="error" 
                startIcon={<DeleteIcon />}
                onClick={handleDeleteConfirmDialogOpen}
              > 
                Delete Task
              </Button>
            </Typography>
          </Stack>
        </Box>
      </Card>
      <ConfirmationDialogBox 
        open={openDeleteConfirmDialog} 
        handleClose={handleDeleteConfirmDialogClose}
        handleConfirm={handleDeleteConfirm}
        dialogBody={DELETE_TASK_CONFIRM_MESSAGE}
      />
      <ConfirmationDialogBox 
        open={openSetStatusConfirmDialog} 
        handleClose={handleSetCompleteConfirmDialogClose}
        handleConfirm={handleSetStatusConfirm}
        dialogBody={!taskStatusIsComplete ? STATUS_COMPLETE_UPDATE_CONFIRM_MESSAGE : STATUS_INCOMPLETE_UPDATE_CONFIRM_MESSAGE}
      />

      { deletApiErrorOccurred ? <Alert severity="error">{ TASK_DELETE_ERROR }</Alert> : null }
      { updateApiErrorOccurred ? <Alert severity="error">{TASK_UPDATE_ERROR}</Alert> : null }
    </div>
    
  )
}

export default Task
