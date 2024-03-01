import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '@/utils/sorts'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  closestCorners,
  defaultDropAnimationSideEffects,
  getFirstCollision,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '@/utils/formatters'

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

  const lastOverId = useRef(null)

  const [orderedColumnsState, setOrderedColumnsState] = useState([])
  // At a certain point, only 1 item can be dragged
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  // At a certain point, only 1 type of item can be dragged
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  // TODO: Use when dragging a card - value is the data of the droppable column
  const [oldColumn, setOldColumn] = useState(null)

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

  // TODO: Update state when moving card between different columns
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumnsState(prev => {
      // Find the position where the dragging card will be drop into
      const overCardIndex = overColumn?.cards?.findIndex(
        c => c._id === overCardId
      )

      // Check if the dragging item is dragged below or on top of the dragged over item
      let newCardIndex = 0

      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1

      // This part is kind of redundant, its purpose is to seperate with the prev data
      const newColumns = cloneDeep(prev)
      const nextActiveColumn = newColumns.find(c => c._id === activeColumn._id)
      const nextOverColumn = newColumns.find(c => c._id === overColumn._id)

      if (nextActiveColumn) {
        // Remove the dragged card from its previous column
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          card => card._id !== activeDraggingCardId
        )

        // Add placeholder card if column is empty
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // Update card order ids prop
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          card => card._id
        )
      }

      if (nextOverColumn) {
        // Incase the dragged card is somehow exist in the new column???
        nextOverColumn.cards = nextOverColumn.cards.filter(
          card => card._id !== activeDraggingCardId
        )

        // Confirm columnId
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        // Insert the dragged card into the new column
        // nextOverColumn.cards.splice(newCardIndex, 0, activeDraggingCardData)
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        )

        // Delete placeholder card if exist
        nextOverColumn.cards = nextOverColumn.cards.filter(
          card => !card.fe_placeholder_card
        )

        // Update card order ids prop
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return newColumns
    })
  }

  const handleDragEnd = event => {
    // console.log('Handle Drag End: ', event)

    // event.active - dragged item and event.over - dragged into item
    const { active, over } = event

    // If dragged to somewhere not supported by the logic
    if (!active || !over) return

    // Detect if dragging card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      const { id: overCardId } = over

      // Find column base on cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // If dragged to somewhere not supported by the logic
      if (!oldColumn || !overColumn) return

      // Handle the case where dragging to the same column
      if (oldColumn._id === overColumn._id) {
        const oldCardIndex = oldColumn.cards.findIndex(
          c => c._id === activeDragItemId
        )
        const newCardIndex = overColumn.cards.findIndex(
          c => c._id === overCardId
        )

        const dndOrderedCards = arrayMove(
          oldColumn.cards,
          oldCardIndex,
          newCardIndex
        )

        // Data that will be sent to API
        const dndOrderedCardIds = dndOrderedCards.map(c => c._id)

        setOrderedColumnsState(prev => {
          const newColumns = cloneDeep(prev)
          const targetColumn = newColumns.find(c => c._id === overColumn._id)

          if (targetColumn) {
            targetColumn.cards = dndOrderedCards
            targetColumn.cardOrderIds = dndOrderedCardIds
          }

          return newColumns
        })
      } else {
        // Handle the case where dragging to different column
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      }
    }

    // Detect if dragging column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
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

    // Reset states to end a drag cycle
    setOldColumn(null)
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const handleDragStart = event => {
    // console.log('Handle Drag Start: ', event)
    setActiveDragItemId(event.active?.id)
    setActiveDragItemData(event.active?.data?.current)

    if (event.active?.data?.current?.columnId) {
      setActiveDragItemType(ACTIVE_DRAG_ITEM_TYPE.CARD)
      // .id is the id of the dragged item
      setOldColumn(findColumnByCardId(event.active?.id))
    } else {
      setActiveDragItemType(ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    }
  }

  const findColumnByCardId = cardId => {
    return orderedColumnsState.find(column =>
      column.cards.some(card => card._id === cardId)
    )
  }

  // This will be triggered while dragging item
  const handleDragOver = event => {
    // console.log('Handle Drag Over: ', event)

    // Detect if dragging column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return
    }

    // Handle dragging card case - drag between columns for example
    const { active, over } = event

    if (!active || !over) return

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    const { id: overCardId } = over

    // Find column base on cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // If dragged to somewhere not supported by the logic
    if (!activeColumn || !overColumn) return

    // Handle the case where dragging to different column
    // In the case of same column, we will handle it in handleDragEnd
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  // Custom collision algorithm
  const collisionDetectionStrategy = useCallback(
    args => {
      // The flickering eff happens when dragging card between columns not dragging columns
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      const pointerIntersections = pointerWithin(args)

      if (!pointerIntersections.length) return

      // Get array of intersected items with the dragging item
      // const intersections =
      //   pointerIntersections.length > 0
      //     ? pointerIntersections
      //     : rectIntersection(args)

      // Get the first intersected item
      let overId = getFirstCollision(pointerIntersections, 'id')

      if (overId) {
        // If the overId is the column id then we will find the closest cardId
        const checkColumn = orderedColumns.find(column => column.id === overId)
        if (checkColumn) {
          // In this case closestCenter will also works but closestCorners will give a smoother experience
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              container =>
                container.id !== overId &&
                checkColumn.cardOrderIds?.includes(container.id)
            )[0]?.id
          })
        }

        lastOverId.current = overId

        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )

  // Only closestCorners will have flickering bug
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={collisionDetectionStrategy}
      onDragOver={handleDragOver}
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
