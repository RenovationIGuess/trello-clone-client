import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '@/utils/sorts'
import { useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

// Animation when drop item
const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5'
      }
    }
  })
}

const BoardContent = ({ board }) => {
  const orderedColumns = useMemo(() => {
    return mapOrder(board?.columns, board?.columnOrderIds, '_id')
  }, [board?.columns, board?.columnOrderIds])

  const [orderedColumnsState, setOrderedColumnsState] = useState([])
  // At a certain point, only 1 item can be dragged
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  // At a certain point, only 1 type of item can be dragged
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

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
    console.log('Handle Drag End: ', event)
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

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const handleDragStart = event => {
    console.log('Handle Drag Start: ', event)
    setActiveDragItemId(event.active?.id)
    setActiveDragItemType(
      event.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event.active?.data?.current)
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
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
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
