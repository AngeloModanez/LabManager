import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Pesquisar...',
  ...props
}) => {
  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'text.secondary' }} />
          </InputAdornment>
        ),
      }}
      sx={{ 
        minWidth: 350,
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
        }
      }}
      {...props}
    />
  );
};

export default SearchBar;