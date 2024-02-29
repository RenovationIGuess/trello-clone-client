import React from 'react'
import Box from '@mui/material/Box'
import Card from './Card/Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

const ListCards = ({ cards }) => {
  return (
    <SortableContext
      items={cards?.map(c => c._id)}
      strategy={verticalListSortingStrategy}
    >
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
    </SortableContext>
  )
}

export default ListCards
