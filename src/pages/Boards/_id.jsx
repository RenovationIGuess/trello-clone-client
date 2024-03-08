import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '@/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '@/apis/mock-data'
import {
  createNewCardAPI,
  createNewColumnAPI,
  fetchBoardDetailsAPI
} from '@/apis'

const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '65e7fe950cd98d969f775bfa'

    fetchBoardDetailsAPI(boardId).then(data => {
      setBoard(data)
    })
  }, [])

  const createNewColumn = async newColumnData => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // Update board state
    setBoard(prev => {
      return {
        ...prev,
        columns: [...prev.columns, createdColumn]
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
            return {
              ...column,
              cards: [...column.cards, createdCard]
            }
          }
          return column
        })
      }
    })
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
      />
    </Container>
  )
}

export default Board
