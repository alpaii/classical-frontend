import axios from 'axios'
import { convertSnakeToCamel } from '../../../utils/formatters' // ✅ 유틸 함수 가져오기

const API_URL = 'http://127.0.0.1:8000/api/works/'
const PAGE_SIZE = 20
const ITEM = 'work'

// ✅ 목록 가져오기
export const fetchList = async (requestPar, setWorks, setTotalPageCount, setErrorMessage) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        page: requestPar.page,
        composer_id: requestPar.composerId,
        work_no: requestPar.searchWorkNo,
        name: requestPar.searchName,
      },
    })
    setWorks(convertSnakeToCamel(response.data.results))
    setTotalPageCount(Math.ceil(response.data.count / PAGE_SIZE))
  } catch (err) {
    setErrorMessage({
      title: 'Failed to load ' + ITEM,
      err,
    })
  }
}

export const runAddItem = async (addItem, setModalAddVisible, setRequestPar, setErrorMessage) => {
  if (!addItem.workNo || !addItem.name) {
    alert('Please enter both work_no and name')
    return
  }

  try {
    await axios.post(API_URL, {
      composer: addItem.composerId,
      work_no: addItem.workNo,
      name: addItem.name,
    })
    setRequestPar((prev) => ({ ...prev }))
    setModalAddVisible(false)
  } catch (err) {
    setErrorMessage({
      title: 'Failed to add ' + ITEM,
      err,
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
      composer: editItem.composerId,
      work_no: editItem.workNo,
      name: editItem.name,
    })
    setRequestPar((prev) => ({ ...prev }))
    setModalEditVisible(false)
  } catch (err) {
    setErrorMessage({
      title: 'Failed to edit ' + ITEM,
      err,
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
      err,
    })
  }
}
