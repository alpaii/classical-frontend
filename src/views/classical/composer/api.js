import axios from 'axios'
import { convertSnakeToCamel } from '../../../utils/formatters' // ✅ 유틸 함수 가져오기

const API_URL = 'http://127.0.0.1:8000/api/composers/'
const PAGE_SIZE = 20

// ✅ 작곡가 목록 가져오기
export const fetchList = async (
  requestPar,
  setComposers,
  setTotalPageCount,
  setErrorMessage,
  setModalErrorVisible,
) => {
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
      title: 'Failed to load composers',
      content: err.message,
    })
    setModalErrorVisible(true)
  }
}

export const runAddItem = async (
  addItem,
  setRequestPar,
  setModalAddVisible,
  setAddItem,
  setErrorMessage,
  setModalErrorVisible,
) => {
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
    setAddItem({ name: '', fullName: '' })
  } catch (err) {
    setErrorMessage({
      title: 'Failed to add composers',
      content: err.message,
    })
    setModalErrorVisible(true)
  }
}

export const runEditItem = async (
  editItem,
  setRequestPar,
  setModalEditVisible,
  setErrorMessage,
  setModalErrorVisible,
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
      title: 'Failed to edit composers',
      content: err.message,
    })
    setModalErrorVisible(true)
  }
}

export const runDeleteItem = async (
  deleteItem,
  setRequestPar,
  setModalDeleteVisible,
  setErrorMessage,
  setModalErrorVisible,
) => {
  try {
    await axios.delete(`${API_URL}${deleteItem.id}/`)
    setRequestPar((prev) => ({ ...prev }))
    setModalDeleteVisible(false)
  } catch (err) {
    setErrorMessage({
      title: 'Failed to delete composers',
      content: err.message,
    })
    setModalErrorVisible(true)
  }
}
