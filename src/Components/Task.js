import { formatDateString } from '../util/appUtil'
import { appDateFormat } from '../constants/appConstants'
import UserTaskStatuses from '../constants/userTaskStatuses'
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete';

const Task = ({ task, onDelete, onToggle }) => {
  return (
    <Card variant="outlined" className="task">
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography gutterBottom variant="h5" component="div">
              {task.title}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              {formatDateString(task.day, appDateFormat)}
            </Typography>
          </Stack>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography color={`${task.status === UserTaskStatuses.COMPLETE ? 'green' : 'red' }`} gutterBottom variant="h5" component="div">
              {task.status}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              <Button variant="contained" color="error" startIcon={<DeleteIcon />}>Delete Task</Button>
            </Typography>
          </Stack>
        </Box>
      </Card>
  )
}

export default Task
