import { useSelector, useDispatch } from "react-redux";
import Task from "./Task";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { tasksFetchedByPage, scrolledToNextPage } from "../state/slices/userTasksSlice";
import { filterUserTasks, retrieveAllTasks, sortUserTasksByLatestDueDates } from "../services/userTasksService";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { TASKS_GET_ERROR } from "../constants/appErrors";
import { Button } from "@mui/material";

const Tasks = () => {

  const { userTasks, pageNumber } = useSelector((state) => state.tasks);

  const dispatchToStore = useDispatch();

  const numberOfUserTasksPagesOnAppLoad = userTasks[0].numberOfPagesOfUserTasks;


  const [taskListLoading, setTaskListLoading] = useState(false);
  const [taskListReversed, setTaskListReversed] = useState(false);

  const [getApiErrorOccurred, setGetApiErrorOccurred] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [dateQuery, setDateQuery] = useState(null);
  const filteredUserTasks = filterUserTasks(searchQuery, dateQuery, userTasks);
  const sortedUserTasks = sortUserTasksByLatestDueDates(filteredUserTasks);

  useEffect(() => {
    if (taskListLoading) {
      if (pageNumber <= numberOfUserTasksPagesOnAppLoad) {
        retrieveAllTasks(pageNumber)
          .then(response => {
            if (response.data.length > 0) {
              dispatchToStore(tasksFetchedByPage(response.data));
            }
            setTaskListLoading(false);
          })
            .catch(error => {
            setGetApiErrorOccurred(true);
            setTaskListLoading(false);
          });
      } else {
        setTaskListLoading(false);
      }
    } 
  }, [taskListLoading, pageNumber, numberOfUserTasksPagesOnAppLoad, dispatchToStore]);

  const handleOnScroll = (e) => {
    const target = e.target;

    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      dispatchToStore(scrolledToNextPage());
      setTaskListLoading(true);
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

      {taskListLoading ? 
        <Box sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
      : null}
      
    </>
  )
};

export default Tasks
