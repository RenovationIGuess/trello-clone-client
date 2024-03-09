import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '@/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '@/apis/mock-data'
import {
  createNewCardAPI,
  createNewColumnAPI,
  fetchBoardDetailsAPI,
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI
} from '@/apis'
import { generatePlaceholderCard } from '@/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '@/utils/sorts'
import { CircularProgress, Typography } from '@mui/material'

const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '65e7fe950cd98d969f775bfa'

    fetchBoardDetailsAPI(boardId).then(data => {
      // Sort before passing data
      data.columns = mapOrder(data.columns, data.columnOrderIds, '_id')

      // Handle case column doesn't have any card => generate placeholder card
      data.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          const placeholderCard = generatePlaceholderCard(column)
          column.cards = [placeholderCard]
          column.cardOrderIds = [placeholderCard._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(data)
    })
  }, [])

  const createNewColumn = async newColumnData => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // New column will be empty => generate placeholder card
    const placeholderCard = generatePlaceholderCard(createdColumn)
    createdColumn.cards = [placeholderCard]
    createdColumn.cardOrderIds = [placeholderCard._id]

    // Update board state
    setBoard(prev => {
      return {
        ...prev,
        columns: [...prev.columns, createdColumn],
        columnOrderIds: [...prev.columnOrderIds, createdColumn._id]
      }
    })
  }

  const createNewCard = async newCardData => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Update board state
    setBoard(prev => {
      return {
        ...prev,
        columns: prev.columns.map(column => {
          if (column._id === newCardData.columnId) {
            if (column.cards.some(card => card.fe_placeholder_card)) {
              column.cards = column.cards.filter(
                card => !card.fe_placeholder_card
              )
              column.cardOrderIds = column.cardOrderIds.filter(
                cardId => !cardId.includes('placeholder-card')
              )
            }

            return {
              ...column,
              cards: [...column.cards, createdCard],
              cardOrderIds: [...column.cardOrderIds, createdCard._id]
            }
          }
          return column
        })
      }
    })
  }

  console.log(board)

  // Call api to update column order after dragging
  const moveColumns = dndOrderedColumns => {
    // This is the data to be updated when call API
    const dndOrderedColumnIds = dndOrderedColumns.map(column => column._id)

    setBoard(prev => {
      return {
        ...prev,
        columns: dndOrderedColumns,
        columnOrderIds: dndOrderedColumnIds
      }
    })

    // Call api
    updateBoardDetailsAPI(board._id, {
      columnOrderIds: dndOrderedColumnIds
    })
  }

  /**
   * Update card order ids only
   * Of the column containing the card being dragged
   */
  const moveCardInTheSameColumn = (
    columnId,
    dndOrderedCards,
    dndOrderedCardIds
  ) => {
    setBoard(prev => {
      return {
        ...prev,
        columns: prev.columns.map(column => {
          if (column._id === columnId) {
            return {
              ...column,
              cards: dndOrderedCards,
              cardOrderIds: dndOrderedCardIds
            }
          }
          return column
        })
      }
    })

    // Call api
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderedCardIds
    })
  }

  /**
   * Move card to different column
   * 1. Remove card from source column
   * 2. Add card to destination column
   * 3. Update card order ids of both columns
   * 4. Update card columnId
   */
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnIds = dndOrderedColumns.map(column => column._id)

    setBoard(prev => {
      return {
        ...prev,
        columns: dndOrderedColumns,
        columnOrderIds: dndOrderedColumnIds
      }
    })

    let prevCardOrderIds =
      dndOrderedColumns.find(column => column._id === prevColumnId)
        ?.cardOrderIds || []

    if (prevCardOrderIds[0].includes('placeholder-card')) {
      prevCardOrderIds = []
    }

    // Call api to update data
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(
        column => column._id === nextColumnId
      )?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}
      >
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Container>
    )
  }

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh'
      }}
    >
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
