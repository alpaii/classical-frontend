import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormLabel,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilX, cilCheck, cilMedicalCross, cilReload } from '@coreui/icons'

const API_COMPOSERS = 'http://127.0.0.1:8000/api/composers/' // Composer API
const API_WORKS = 'http://127.0.0.1:8000/api/works/' // Work API

const Work = () => {
  const [composers, setComposers] = useState([]) // 작곡가 목록
  const [selectedComposer, setSelectedComposer] = useState('') // 선택한 작곡가
  const [works, setWorks] = useState([]) // Work 목록
  const [newWork, setNewWork] = useState({ work_no: '', name: '' }) // 새 Work 추가 상태
  const [editingId, setEditingId] = useState(null) // 편집 중인 Work ID
  const [editedWork, setEditedWork] = useState({ work_no: '', name: '' }) // 편집 중인 Work 데이터
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchComposers()
  }, [])

  useEffect(() => {
    if (selectedComposer) {
      fetchWorks(selectedComposer)
    }
  }, [selectedComposer])

  // 📌 Composer 목록 가져오기
  const fetchComposers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_COMPOSERS)
      setComposers(response.data)
    } catch (err) {
      setError('Failed to load composers')
    } finally {
      setLoading(false)
    }
  }

  // 📌 선택한 Composer의 Work 목록 가져오기
  const fetchWorks = async (composerId) => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_WORKS}?composer=${composerId}`)
      setWorks(response.data['results'])
    } catch (err) {
      setError('Failed to load works')
    } finally {
      setLoading(false)
    }
  }

  // 📌 새로운 Work 추가
  const addWork = async () => {
    if (!newWork.work_no || !newWork.name || !selectedComposer) {
      alert('Please enter all fields')
      return
    }

    try {
      await axios.post(API_WORKS, { ...newWork, composer: selectedComposer })
      fetchWorks(selectedComposer) // 목록 다시 불러오기
      setNewWork({ work_no: '', name: '' }) // 입력 필드 초기화
    } catch (err) {
      alert('Failed to add work')
    }
  }

  // 📌 편집 모드 활성화
  const startEditing = (work) => {
    setEditingId(work.id)
    setEditedWork({ work_no: work.work_no, name: work.name })
  }

  // 📌 Work 수정 요청
  const updateWork = async (id) => {
    try {
      await axios.put(`${API_WORKS}${id}/`, editedWork)
      fetchWorks(selectedComposer) // 목록 갱신
      setEditingId(null)
    } catch (err) {
      alert('Failed to update work')
    }
  }

  // 📌 Work 삭제 요청
  const deleteWork = async (id) => {
    try {
      await axios.delete(`${API_WORKS}${id}/`)
      fetchWorks(selectedComposer)
      setEditingId(null)
    } catch (err) {
      alert('Failed to delete work')
    }
  }

  // 📌 편집 취소
  const cancelEditing = () => {
    setEditingId(null)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 border-secondary border-top-2">
          <CCardHeader>Work List</CCardHeader>
          <CCardBody>
            {/* Composer 선택 */}
            <CRow className="mb-3">
              <CFormLabel className="col-2 col-form-label">Composer</CFormLabel>
              <CCol sm={4}>
                <CFormSelect
                  className="mb-3"
                  value={selectedComposer}
                  onChange={(e) => setSelectedComposer(e.target.value)}
                >
                  <option value="">Select a Composer</option>
                  {composers.map((composer) => (
                    <option key={composer.id} value={composer.id}>
                      {composer.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            {/* Work 테이블 */}
            <CTable bordered className="table-fixed">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell className="col-3">Work No</CTableHeaderCell>
                  <CTableHeaderCell className="col-5">Name</CTableHeaderCell>
                  <CTableHeaderCell className="col-2"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {/* ✅ Work 추가 입력 필드 */}
                <CTableRow color="info">
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      placeholder="Work No"
                      value={newWork.work_no}
                      onChange={(e) => setNewWork({ ...newWork, work_no: e.target.value })}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      placeholder="Work Name"
                      value={newWork.name}
                      onChange={(e) => setNewWork({ ...newWork, name: e.target.value })}
                    />
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton color="success" variant="ghost" onClick={addWork}>
                      <CIcon icon={cilMedicalCross} size="l" />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>

                {/* ✅ Work 목록 */}
                {works.map((work) =>
                  editingId === work.id ? (
                    <CTableRow key={work.id} color="warning">
                      <CTableDataCell>
                        <CFormInput
                          type="text"
                          value={editedWork.work_no}
                          onChange={(e) =>
                            setEditedWork({ ...editedWork, work_no: e.target.value })
                          }
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          type="text"
                          value={editedWork.name}
                          onChange={(e) => setEditedWork({ ...editedWork, name: e.target.value })}
                        />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="secondary"
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                        >
                          <CIcon icon={cilReload} size="l" />
                        </CButton>
                        <CButton
                          color="info"
                          variant="ghost"
                          size="sm"
                          onClick={() => updateWork(work.id)}
                        >
                          <CIcon icon={cilCheck} size="l" />
                        </CButton>
                        <CButton
                          color="danger"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteWork(work.id)}
                        >
                          <CIcon icon={cilX} size="l" />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    <CTableRow key={work.id}>
                      <CTableDataCell>{work.work_no}</CTableDataCell>
                      <CTableDataCell>{work.name}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="info"
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(work)}
                        >
                          <CIcon icon={cilPencil} size="l" />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ),
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Work
