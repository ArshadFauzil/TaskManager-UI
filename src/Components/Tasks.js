import { useSelector } from "react-redux"
import Task from "./Task"
import { useState } from "react";
import SearchBar from "./SearchBar";
import { filterUserTasks, sortUserTasksByDueDate } from "../services/userTasksService";


const Tasks = () => {

  const userTasks = useSelector(state => state.tasks.userTasks);

  const [searchQuery, setSearchQuery] = useState("");
  const [dateQuery, setDateQuery] = useState(null);
  const filteredUserTasks = filterUserTasks(searchQuery, dateQuery, userTasks);
  sortUserTasksByDueDate(filterUserTasks);

  return (
    <>
      <SearchBar setSearchQuery={setSearchQuery} setDateQuery={setDateQuery} />
      {filteredUserTasks.length > 0 ? 
      filteredUserTasks.map((task) => (
        <Task key={task.id} task={task} />
      )) : 
      'No tasks'}
      
    </>
  )
};

export default Tasks
