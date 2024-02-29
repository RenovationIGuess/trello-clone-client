import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

const ListColumns = ({ columns }) => {
  return (
    <Box
      sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        width: '100%',
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        oveflowY: 'hidden'
      }}
    >
      {/* {Array.from({ length: 10 }).map((_, index) => (
        <Column key={index} />
      ))} */}
      {columns?.map(column => (
        <Column key={column._id} column={column} />
      ))}

      {/* Add new column button */}
      <Box
        sx={{
          minWidth: '200px',
          maxWidth: '200px',
          // mx: 2,
          borderRadius: '6px',
          height: 'fit-content',
          bgcolor: '#ffffff3d'
        }}
      >
        <Button
          startIcon={<NoteAddIcon />}
          sx={{
            color: 'white',
            width: '100%'
          }}
        >
          Add new column
        </Button>
      </Box>
    </Box>
  )
}

export default ListColumns
