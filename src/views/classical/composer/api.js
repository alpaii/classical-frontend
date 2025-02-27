import axios from 'axios'
import { convertSnakeToCamel } from '../../../utils/formatters' // ✅ 유틸 함수 가져오기

const API_URL = 'http://127.0.0.1:8000/api/composers/'
const PAGE_SIZE = 20
const ITEM = 'composer'

// ✅ 작곡가 목록 가져오기
export const fetchList = async (requestPar, setComposers, setTotalPageCount, setErrorMessage) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        page: requestPar.page,
        full_name: requestPar.searchFullName,
      },
    })
    setComposers(convertSnakeToCamel(response.data.results))
    setTotalPageCount(Math.ceil(response.data.count / PAGE_SIZE))
  } catch (err) {
    setErrorMessage({
      title: 'Failed to load ' + ITEM,
      content: err.message,
    })
  }
}

export const runAddItem = async (addItem, setModalAddVisible, setRequestPar, setErrorMessage) => {
  if (!addItem.name || !addItem.fullName) {
    alert('Please enter both name and full name')
    return
  }

  try {
    await axios.post(API_URL, {
      name: addItem.name,
      full_name: addItem.fullName,
    })
    setRequestPar((prev) => ({ ...prev }))
    setModalAddVisible(false)
  } catch (err) {
    setErrorMessage({
      title: 'Failed to add ' + ITEM,
      content: err.message,
    })
  }
}

export const runEditItem = async (
  editItem,
  setModalEditVisible,
  setRequestPar,
  setErrorMessage,
) => {
  try {
    await axios.put(`${API_URL}${editItem.id}/`, {
      name: editItem.name,
      full_name: editItem.fullName,
    })
    setRequestPar((prev) => ({ ...prev }))
    setModalEditVisible(false)
  } catch (err) {
    setErrorMessage({
      title: 'Failed to edit ' + ITEM,
      content: err.message,
    })
  }
}

export const runDeleteItem = async (
  deleteItem,
  setModalDeleteVisible,
  setRequestPar,
  setErrorMessage,
) => {
  try {
    await axios.delete(`${API_URL}${deleteItem.id}/`)
    setRequestPar((prev) => ({ ...prev }))
    setModalDeleteVisible(false)
  } catch (err) {
    setErrorMessage({
      title: 'Failed to delete ' + ITEM,
      content: err.message,
    })
  }
}
