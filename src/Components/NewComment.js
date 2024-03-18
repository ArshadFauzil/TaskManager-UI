import { useState, useEffect } from "react";
import { MinCommentLength, MaxCommentLength } from "../constants/appConstants";
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { COMMENT_CREATE_ERROR, COMMENT_GET_ERROR, MIN_COMMENT_LENGTH_VALIDATION } from '../constants/appErrors';
import { createUserTaskComment, getCommentById } from "../services/userTasksService";

const NewComment = ({ taskId, onNewCommentAddition }) => {

    const [newComment, setNewComment] = useState('');
    const [commentError, setCommentError] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(commentError);

    const [createCommentApiErrorOccurred, setCreateCommentApiErrorOccurred] = useState(false);
    const [getCommentApiErrorOccurred, setGetCommentApiErrorOccurred] = useState(false);

    useEffect(() => {
        setDisableSubmit(commentError);
      }, [commentError, disableSubmit]);

    const handleNewCommentChange = (e) => {
        const value = e.target.value;
        setNewComment(value);
        setCommentError(value.length < MinCommentLength);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        if (Object.keys(newComment).length > 0) {
            createUserTaskComment({ taskId, comment: newComment })
            .then(createResponse => {
                const newCommentId = createResponse.data;
                getCommentById(newCommentId)
                    .then(getResponse => {
                        onNewCommentAddition(getResponse.data);
                        setNewComment('');
                    })
                    .catch(error => {
                        setGetCommentApiErrorOccurred(true);
                    })
            })
            .catch(error => {
                setCreateCommentApiErrorOccurred(true);
            });
        }
        
      }

    return (
        <form onSubmit={onSubmit}>
            <TextField 
                id="outlined-textarea"
                label="New Comment"
                rows={5}
                placeholder="Add Comment"
                className="form-control"
                multiline 
                error={commentError}
                helperText={commentError ? MIN_COMMENT_LENGTH_VALIDATION : null}
                value={newComment} 
                inputProps={{ maxLength: MaxCommentLength }}
                onChange={handleNewCommentChange}
            />
            <Button 
                type="submit" 
                variant="contained" 
                disabled={disableSubmit}
            >
                Add Comment
            </Button>
            { createCommentApiErrorOccurred ? <Alert severity="error">{COMMENT_CREATE_ERROR}</Alert> : null }
            { getCommentApiErrorOccurred ? <Alert severity="error">{COMMENT_GET_ERROR}</Alert> : null }
        </form>
    );
}

export default NewComment;