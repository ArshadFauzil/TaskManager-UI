import { useSelector } from "react-redux"
import Task from "./Task"

const Tasks = ({ tasks, onDelete, onToggle}) => {

  const userTasks = useSelector(state => state.tasks.userTasks);

  return (
    <>
      {userTasks.map((task, index) => (
      <Task key={index} task={task} onDelete={onDelete} onToggle={onToggle} />
      ))}
    </>
  )
};

export default Tasks
