import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '@/utils/sorts'
import { useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

const BoardContent = ({ board }) => {
  const orderedColumns = useMemo(() => {
    return mapOrder(board?.columns, board?.columnOrderIds, '_id')
  }, [board?.columns, board?.columnOrderIds])

  const [orderedColumnsState, setOrderedColumnsState] = useState([])

  useEffect(() => {
    setOrderedColumnsState(orderedColumns)
  }, [orderedColumns])

  // Still bug with this sensor???
  const pointerSensor = useSensor(PointerSensor, {
    // Require the pointer to move 10 pixels before activating
    activationConstraint: {
      distance: 10
    }
  })

  // These will help to avoid the click event trigger the drag end callback
  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10
    }
  })

  // Change tolerance to 500 to fix bug when dragging with pen
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5
    }
  })

  const keyboardSensor = useSensor(KeyboardSensor)

  // Combine mouse and touch sensor to have best UX on mobile without getting glitch bugs
  const sensors = useSensors(
    pointerSensor,
    mouseSensor,
    touchSensor,
    keyboardSensor
  )

  const handleDragEnd = event => {
    console.log(event)
    // event.active - dragged item and event.over - dragged into item
    const { active, over } = event

    // If dragged to somewhere not supported by the logic
    if (!over) return

    // Only if dragged to another position will we update state
    if (active.id !== over.id) {
      // Find the active item - old position
      const draggedColumn = orderedColumnsState.findIndex(
        column => column._id === active.id
      )

      // Find the over item - new position
      const overColumn = orderedColumnsState.findIndex(
        column => column._id === over.id
      )

      // Use arrayMove func to sort - provided by dnd-kit
      // It receives the array, from position, to position
      const dndOrderedColumns = arrayMove(
        orderedColumnsState,
        draggedColumn,
        overColumn
      )

      // This is the data to be updated when call API
      // const dndOrderedColumnIds = dndOrderedColumns.map(column => column._id)

      setOrderedColumnsState(dndOrderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
        <ListColumns columns={orderedColumnsState} />
      </Box>
    </DndContext>
  )
}

export default BoardContent
