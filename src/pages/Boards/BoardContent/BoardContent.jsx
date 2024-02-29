import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '@/utils/sorts'
import { useMemo } from 'react'

const BoardContent = ({ board }) => {
  const orderedColumns = useMemo(() => {
    return mapOrder(board?.columns, board?.columnOrderIds, '_id')
  }, [board?.columns, board?.columnOrderIds])

  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        // pt: 2,
        px: 2,
        pb: 1.75,
        height: theme => theme.trello.boardContentHeight,
        bgcolor: theme =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'
      }}
    >
      <ListColumns columns={orderedColumns} />
    </Box>
  )
}

export default BoardContent
