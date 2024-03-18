import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Tasks from "./Components/Tasks";
import AddTask from "./Components/AddTask";
import TaskView from "./Components/TaskView";
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SideMenu from "./Components/SideMenu";
import { CREATE_TASK_ROUTE, ROOT_ROUTE, UPDATE_TASK_ROUTE, VIEW_TASK_ROUTE } from "./constants/routes";
import EditTask from "./Components/EditTask";


const App = () => {

  return (
    <div>
      <Router>
        <Container className="container window">
          <Box>
            <SideMenu />
          </Box>
          <Box className="main-content">
            <Routes>
                <Route path={ROOT_ROUTE} element={<Tasks />} />
                <Route path={CREATE_TASK_ROUTE} element={<AddTask />} />
                <Route path={VIEW_TASK_ROUTE} element={<TaskView />} />
                <Route path={UPDATE_TASK_ROUTE} element={<EditTask />} />
            </Routes>
          </Box>
        </Container>  
      </Router>
    </div>
  );
}


export default App;
