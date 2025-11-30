import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Box,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onToggleStatus,
  stickyHeader = true,
  size = "small"
}) => {
  return (
    <TableContainer sx={{ 
      flexGrow: 1, 
      border: '1px solid', 
      borderColor: 'divider', 
      borderRadius: 1, 
      overflowX: 'auto',
      height: 'calc(100vh - 280px)',
      overflowY: 'auto'
    }}>
      <Table 
        size={size} 
        stickyHeader={stickyHeader}
        sx={{ 
          '& .MuiTableCell-root': { px: 1 },
          '& .MuiTableBody-root .MuiTableRow-root:nth-of-type(even)': {
            backgroundColor: 'grey.50'
          },
          '& .MuiTableBody-root .MuiTableRow-root:hover': {
            backgroundColor: 'grey.200'
          }
        }}
      >
        <TableHead sx={{ 
          '& .MuiTableCell-head': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 'bold'
          }
        }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field} sx={{ width: column.width }}>
                {column.headerName}
              </TableCell>
            ))}
            <TableCell sx={{ width: 80 }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row._id}>
              {columns.map((column) => (
                <TableCell key={column.field}>
                  {column.field === 'status' && onToggleStatus ? (
                    <Switch
                      checked={row[column.field]}
                      onChange={(e) => onToggleStatus(row, e.target.checked)}
                      size="small"
                    />
                  ) : column.renderCell ? (
                    column.renderCell(row)
                  ) : (
                    row[column.field] || 'N/A'
                  )}
                </TableCell>
              ))}
              <TableCell>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {onEdit && (
                    <IconButton
                      size="small"
                      onClick={() => onEdit(row)}
                      color="primary"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton
                      size="small"
                      onClick={() => onDelete(row._id)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;