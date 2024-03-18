import { useSelector, useDispatch } from "react-redux"
import Task from "./Task"
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { tasksFetchedByPage, scrolledToNextPage } from "../state/slices/userTasksSlice";
import { filterUserTasks, retrieveAllTasks, sortUserTasksByLatestDueDates } from "../services/userTasksService";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { TASKS_GET_ERROR } from "../constants/appErrors";
import { createSelector } from 'reselect';
import { Button } from "@mui/material";

const Tasks = () => {

  const userTasks = useSelector(state => state.tasks.userTasks);
  //const persistedPageNumber = useSelector(state => state.tasks.pageNumber);

  const persistedPageNumber = (state) => state.tasks.pageNumber;

  const dispatchToStore = useDispatch();

  const [taskListReversed, setTaskListReversed] = useState(false);

  const [loading, setLoading] = useState(false);

  const [samplePageNum, setSamplePageNum] = useState(1);

  const [getApiErrorOccurred, setGetApiErrorOccurred] = useState(false)

  const [searchQuery, setSearchQuery] = useState("");
  const [dateQuery, setDateQuery] = useState(null);
  const filteredUserTasks = filterUserTasks(searchQuery, dateQuery, userTasks);
  const sortedUserTasks = sortUserTasksByLatestDueDates(filteredUserTasks);

  const persistedPageNumberSelector = createSelector(
    [persistedPageNumber],
    (updatedPageNumber) => updatedPageNumber
  );

  const handleOnScroll = (e) => {
    const target = e.target;

    if (target.scrollHeight - target.scrollTop === target.clientHeight)
    {
      dispatchToStore(scrolledToNextPage());
      setLoading(true);
          retrieveAllTasks(persistedPageNumber)
          .then(response => {
            dispatchToStore(tasksFetchedByPage(response.data));
            setLoading(false);
          })
            .catch(error => {
            setGetApiErrorOccurred(true);
          });
    }
  }

  return (
    <>
      <SearchBar setSearchQuery={setSearchQuery} setDateQuery={setDateQuery} />

      <Button 
      variant="text" 
      onClick={() => setTaskListReversed(!taskListReversed)}
      >
        {!taskListReversed ? 'Sort By oldest' : 'Sort By latest'}
      </Button>

      { getApiErrorOccurred ? <Alert severity="error">{TASKS_GET_ERROR}</Alert> : null }

      <div className="task-list" onScroll={handleOnScroll}>
        {taskListReversed ? 
        sortedUserTasks.reverse().length > 0 ? 
          sortedUserTasks.map((task) => (
            <Task key={task.id} task={task} />
          )) : 
          'No tasks' : 
          sortedUserTasks.length > 0 ? 
            sortedUserTasks.map((task) => (
              <Task key={task.id} task={task} />
            )) : 
            'No tasks'
          }
        
      </div>

      {loading ? 
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
      : null}
      
    </>
  )
};

export default Tasks
