import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import AppBar from '@/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '@/apis/mock-data'
import { fetchBoardDetailsAPI } from '@/apis'

const Board = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    const boardId = '65e7fe950cd98d969f775bfa'

    fetchBoardDetailsAPI(boardId).then(data => {
      setBoard(data)
    })
  }, [])

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh'
      }}
    >
      <AppBar />
      <BoardBar board={mockData.board} />
      <BoardContent board={mockData.board} />
    </Container>
  )
}

export default Board
