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
        minWidth: { xs: '100%', sm: 300 },
        width: { xs: '100%', sm: 'auto' },
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
        }
      }}
      {...props}
    />
  );
};

export default SearchBar;