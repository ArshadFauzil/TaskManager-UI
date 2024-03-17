import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import { formatDateString } from '../util/appUtil'
import { appDateFormat } from '../constants/appConstants'
import UserTaskStatuses from '../constants/userTaskStatuses'
import Typography from '@mui/material/Typography';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { UPDATE_TASK_ROUTE } from '../constants/routes';
import { retrieveAllCommentsForTasks } from '../services/userTasksService';
import Alert from '@mui/material/Alert';
import { COMMENTS_GET_ERROR } from '../constants/appErrors';
import Comment from './Comment';
import NewComment from './NewComment';


const TaskView = () => {

    const location = useLocation();
    const task = location.state;
    const navigate = useNavigate();

    const [comments, setComments] = useState([]);
    const [commentGetApiErrorOccurred, setCommentGetApiErrorOccurred] = useState(false);

    useEffect(() => {
        if (!comments.length) {
            retrieveAllCommentsForTasks(task.id)
            .then(getResponse => {
                setComments(getResponse.data);
            })
            .catch(error => {
                setCommentGetApiErrorOccurred(true);
            })
        }
    }, [comments, task.id]);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));

    const handleOnEditClick = () => navigate(UPDATE_TASK_ROUTE, { state: task });

    const onCommentUpdate = (updatedComment) => {
        setComments([...comments.filter(c => c.id !== updatedComment.id), updatedComment]);
    }

    const onCommentDelete = (deletedComment) => {
        setComments([...comments.filter(c => c.id !== deletedComment.id)]);
    }

    const onNewCommentAddition = (newComment) => {
        setComments([...comments, newComment]);
    }
      
      return (
        <Box sx={{ width: '100%' }}>
            <Stack spacing={2}>
                <Item>
                    <Typography gutterBottom variant="h5" component="div">
                        {task.title}
                    </Typography>
                </Item>
                <Item>
                    {task.description}
                </Item>
                <Item>
                    {formatDateString(task.dueDate, appDateFormat)}
                </Item>
                <Item>
                <Typography color={`${task.status === UserTaskStatuses.COMPLETE ? 'green' : 'red' }`} gutterBottom variant="h6" component="div">
                    {task.status}
                </Typography>
                </Item>
            </Stack>
            <Button 
            variant="contained"
            onClick={handleOnEditClick}>
                Edit Task
            </Button>

            <NewComment taskId={task.id} onNewCommentAddition={onNewCommentAddition} />

            <Stack spacing={2}>
                {comments.length > 0 ? 
                comments.map((comment) => (
                    <Comment 
                        key={comment.id} 
                        comment={comment} 
                        onCommentUpdate={onCommentUpdate} 
                        onCommentDelete={onCommentDelete}
                    />
                )) : 
                'No Comments'}
            </Stack>
            { commentGetApiErrorOccurred ? <Alert severity="error">{COMMENTS_GET_ERROR}</Alert> : null }
        </Box>
      );
}

export default TaskView;