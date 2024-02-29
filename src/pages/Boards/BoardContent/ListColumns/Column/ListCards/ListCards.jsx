import React from 'react'
import Box from '@mui/material/Box'
import Card from './Card/Card'

const ListCards = ({ cards }) => {
  return (
    <Box
      sx={{
        px: 1.75,
        mx: 0.25,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        pb: '4px',
        maxHeight: theme =>
          `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} - ${theme.trello.columnHeaderHeight} - ${theme.trello.columnFooterHeight})`
      }}
    >
      {/* {Array.from({ length: 20 }).map((_, i) => (
        <Card key={i} />
      ))} */}
      {cards?.map(card => (
        <Card key={card._id} card={card} />
      ))}
    </Box>
  )
}

export default ListCards
