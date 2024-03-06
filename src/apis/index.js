import { API_ROOT } from '@/utils/constants'
import axios from 'axios'

export const fetchBoardDetailsAPI = async boardId => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)

  return response.data
}
