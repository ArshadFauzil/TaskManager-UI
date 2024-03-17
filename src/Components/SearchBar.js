import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const SearchBar = ({ setSearchQuery, setDateQuery }) => {

    return (
        <form className="search-form">
            <TextField
                id="search-bar"
                className="search"
                onInput={(e) => {
                    setSearchQuery(e.target.value);
                }}
                label="Search By Title"
                variant="outlined"
                placeholder="Search By Title..."
                size="small"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker 
                    id="date-search"
                    label="Search by Due Date" 
                    className="search"
                    placeholder="Search by Due Date..."
                    slotProps={{
                        actionBar: {
                          actions: ['clear']
                        }
                      }}
                    onChange={(e) => {
                        setDateQuery(e);
                    }}
                />
            </LocalizationProvider>
            
        </form>
    );
    

}

export default SearchBar;