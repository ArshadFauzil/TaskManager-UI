import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Tasks from "./Components/Tasks";
import AddTask from "./Components/AddTask";
import About from "./Components/About";
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


const App = () => {

  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5001/tasks') 
    const data = await res.json()

    return data
  }

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5001/tasks/${id}`) 
    const data = await res.json()

    return data
  }

  //Add Task
  const addTask = async  (task) => {
    const res = await fetch('http://localhost:5001/tasks', { 
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()

    setTasks([ ...tasks, data ])

    //const id = Math.floor(Math.random() * 10000) + 1
    //const newTask = { id, ...task }
    //setTasks([ ...tasks, newTask ])
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5001/tasks/${id}`, { method: 'DELETE' })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updatedtask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5001/tasks/${id}`, { 
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updatedtask)
    })

    const data = await res.json()

    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: !data.reminder } : task))
  }

  return (
    <Router>
      <Container className="container">
        <Box >
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAddTask={showAddTask}/>
          <Divider />
          <Routes>
            <Route path="/" element={
              <>
                {showAddTask && <AddTask onAdd={addTask}/>}
                {tasks.length > 0 ? <Tasks 
                  tasks={tasks} 
                  onDelete={deleteTask} 
                  onToggle={toggleReminder} /> : 'No tasks'}
              </>
            } />
            <Route path="/about" element={<About />} />
          </Routes>

          <Footer />

        </Box>
      </Container>  
    </Router>
  );
}


export default App;
