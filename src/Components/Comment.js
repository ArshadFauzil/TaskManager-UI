import Paper from '@mui/material/Paper';
import Grid from "@mui/material//Grid";
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import { COMMENTS_GET_ERROR, COMMENT_DELETE_ERROR, COMMENT_UPDATE_ERROR, MIN_COMMENT_LENGTH_VALIDATION } from '../constants/appErrors';
import { MinCommentLength, MaxCommentLength } from "../constants/appConstants";
import { deleteUserTaskComment, getCommentById, updateUserTaskComment } from '../services/userTasksService';
import Alert from '@mui/material/Alert';
import { formatDateString } from '../util/appUtil';
import { appDateFormat } from '../constants/appConstants';
import ConfirmationDialogBox from './commonComponents/ConfirmationDialogBox';
import { DELETE_COMMENT_CONFIRM_MESSAGE } from '../constants/confirmationMessages';

const Comment = ({ comment, onCommentUpdate, onCommentDelete }) => {

    const [editModeOn, setEditModeOn] = useState(false);

    const [editedCommentValue, setEditedCommentValue] = useState(comment.comment);
    const [commentError, setCommentError] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(commentError);

    const [updateCommentApiErrorOccurred, setUpdateCommentApiErrorOccurred] = useState(false);

    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
    const [deletApiErrorOccurred, setDeletApiErrorOccurred] = useState(false);
    const [getCommentApiErrorOccurred, setGetCommentApiErrorOccurred] = useState(false);

    useEffect(() => {
        setDisableSubmit(commentError);
      }, [commentError, disableSubmit]);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));

      const onClickEdit = () => {
        setEditModeOn(true);
      }

      const cancelEdit = () => {
        setEditModeOn(false);
      }

      const handleCommentChange = (e) => {
        const value = e.target.value;
        setEditedCommentValue(value);
        setCommentError(value.length < MinCommentLength);
      }

      const handleDeleteConfirmDialogOpen = () => {
        setOpenDeleteConfirmDialog(true);
      };
    
      const handleDeleteConfirmDialogClose = () => {
        setOpenDeleteConfirmDialog(false);
      };

      const onSubmit = (e) => {
        e.preventDefault();
        
        updateUserTaskComment(comment.id, { comment: editedCommentValue })
            .then(updateResponse => {
                getCommentById(comment.id)
                  .then(getResponse => {
                    onCommentUpdate(getResponse.data);
                    setEditModeOn(false);
                  })
                  .catch(error => {
                    setGetCommentApiErrorOccurred(true);
                  });
                
            })
            .catch(error => {
                setUpdateCommentApiErrorOccurred(true);
            });
      }

      const handleDeleteConfirm = () => {
        setOpenDeleteConfirmDialog(false);
        deleteUserTaskComment(comment.id)
          .then(deleteResponse => {
            onCommentDelete(comment);
          })
          .catch(function (error) {
            setDeletApiErrorOccurred(true);
          });
      };

    return (
        <div>
            {editModeOn ? 
            <form onSubmit={onSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField 
                      id="outlined-textarea"
                      label="Edit Comment"
                      rows={5}
                      placeholder="Add Comment"
                      className="form-control"
                      multiline 
                      error={commentError}
                      helperText={commentError ? MIN_COMMENT_LENGTH_VALIDATION : null}
                      value={editedCommentValue} 
                      inputProps={{ maxLength: MaxCommentLength }}
                      onChange={handleCommentChange}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      disabled={disableSubmit}
                    >
                        Update Comment
                    </Button>
                  </Grid>
                  <Grid item xs={10}>
                    <Button 
                      type="submit" 
                      color="error"
                      variant="outlined"
                      endIcon={<CancelIcon />}
                      onClick={cancelEdit}
                    >
                        Cancel
                    </Button>
                  </Grid>
              </Grid>
            </form> : 
            <>
                <Item>
                    <Typography gutterBottom variant="p" component="div">
                        {comment.comment}
                    </Typography>
                    <Typography gutterBottom variant="p" component="div">
                        {formatDateString(comment.lastUpdatedDate, appDateFormat)}
                    </Typography>
                </Item>
                <button className="link-button" onClick={onClickEdit}>Edit</button>
                <button className="link-button" onClick={handleDeleteConfirmDialogOpen}>Delete</button>
            </>
            }
            <ConfirmationDialogBox 
                open={openDeleteConfirmDialog} 
                handleClose={handleDeleteConfirmDialogClose}
                handleConfirm={handleDeleteConfirm}
                dialogBody={DELETE_COMMENT_CONFIRM_MESSAGE}
            />
            { updateCommentApiErrorOccurred ? <Alert severity="error">{COMMENT_UPDATE_ERROR}</Alert> : null }
            { deletApiErrorOccurred ? <Alert severity="error">{ COMMENT_DELETE_ERROR }</Alert> : null }
            { getCommentApiErrorOccurred ? <Alert severity="error">{COMMENTS_GET_ERROR}</Alert> : null }
        </div>
    );

};

export default Comment;