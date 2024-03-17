import PropTypes from 'prop-types'
import Button from './Button'
import { useLocation } from 'react-router-dom'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Header = ({ title, onAdd, showAddTask }) => {
  const location = useLocation()

  return (
    <header className='header'>
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          <Typography variant="h3" gutterBottom>
            {title}
          </Typography>
        </Box>
        {location.pathname === '/' && <Button color={showAddTask ? 'red' : 'green'}
            text={showAddTask ? 'Close' : 'Add'} 
            onClick={onAdd}
        />}
    </header>
  )
}

Header.defaultProps = {
    title: 'Task Tracker'
}

Header.propTypes = {
    title: PropTypes.string.isRequired
}

export default Header
