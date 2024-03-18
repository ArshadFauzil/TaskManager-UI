import { useSelector, useDispatch } from "react-redux"
import Task from "./Task"
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { tasksFetchedByPage, scrolledToNextPage } from "../state/slices/userTasksSlice";
import { filterUserTasks, retrieveAllTasks, sortUserTasksByDueDate } from "../services/userTasksService";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { TASKS_GET_ERROR } from "../constants/appErrors";

const Tasks = () => {

  const userTasks = useSelector(state => state.tasks.userTasks);
  const persistedPageNumber = useSelector(state => state.tasks.pageNumber);

  const dispatchToStore = useDispatch();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(persistedPageNumber);

  const [getApiErrorOccurred, setGetApiErrorOccurred] = useState(false)

  const [searchQuery, setSearchQuery] = useState("");
  const [dateQuery, setDateQuery] = useState(null);
  const filteredUserTasks = filterUserTasks(searchQuery, dateQuery, userTasks);
  sortUserTasksByDueDate(filterUserTasks);

  /* useEffect(() => {
    setPageNumber(persistedPageNumber);
  }, [persistedPageNumber, pageNumber]); */

  const handleOnScroll = (e) => {
    const target = e.target;

    if (target.scrollHeight - target.scrollTop === target.clientHeight)
    {
      const temp = pageNumber + 1;
      setPageNumber(pageNumber + 1);
      dispatchToStore(scrolledToNextPage(pageNumber));
    
      setLoading(true);
      retrieveAllTasks(temp)
        .then(response => {
          dispatchToStore(tasksFetchedByPage(response.data));
          setLoading(false);
        })
        .catch(error => {
          setGetApiErrorOccurred(true);
        })
    }
  }

  return (
    <>
      <SearchBar setSearchQuery={setSearchQuery} setDateQuery={setDateQuery} />

      { getApiErrorOccurred ? <Alert severity="error">{TASKS_GET_ERROR}</Alert> : null }

      <div className="task-list" onScroll={handleOnScroll}>
        {filteredUserTasks.length > 0 ? 
        filteredUserTasks.map((task) => (
          <Task key={task.id} task={task} />
        )) : 
        'No tasks'}
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
