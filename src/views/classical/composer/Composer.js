import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilPlus,
  cilMedicalCross,
  cilPencil,
  cilX,
  cilCheck,
  cilCheckAlt,
  cilReload,
} from '@coreui/icons'

const API_URL = 'http://127.0.0.1:8000/api/composers/'

const Composer = () => {
  const [composers, setComposers] = useState([]) // 작곡가 목록 상태
  const [newComposer, setNewComposer] = useState({ name: '', full_name: '' }) // 새 작곡가 입력 상태
  const [editingId, setEditingId] = useState(null) // 현재 편집 중인 작곡가 ID
  const [editedComposer, setEditedComposer] = useState({ name: '', full_name: '' }) // 편집 중인 데이터
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 📌 서버에서 데이터 가져오기
  useEffect(() => {
    fetchComposers()
  }, [])

  const fetchComposers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_URL)
      setComposers(response.data)
    } catch (err) {
      setError('Failed to load composers')
    } finally {
      setLoading(false)
    }
  }

  // 📌 새 작곡가 추가 함수
  const addComposer = async () => {
    if (!newComposer.name || !newComposer.full_name) {
      alert('Please enter both name and full name')
      return
    }

    try {
      const response = await axios.post(API_URL, newComposer) // 서버에 추가 요청
      fetchComposers() // 다시 불러오기
      setNewComposer({ name: '', full_name: '' }) // 입력 필드 초기화
    } catch (err) {
      alert('Failed to add composer')
    }
  }

  // 📌 편집 모드 활성화
  const startEditing = (composer) => {
    setEditingId(composer.id)
    setEditedComposer({ name: composer.name, full_name: composer.full_name })
  }

  // 📌 편집 내용 저장 (업데이트)
  const updateComposer = async (id) => {
    try {
      await axios.put(`${API_URL}${id}/`, editedComposer) // Django API에 PUT 요청
      fetchComposers() // 목록 갱신
      setEditingId(null) // 편집 종료
    } catch (err) {
      alert('Failed to update composer')
    }
  }

  // 📌 편집 데이터 삭제 (delete)
  const deleteComposer = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`) // Django API에 PUT 요청
      fetchComposers() // 목록 갱신
      setEditingId(null) // 편집 종료
    } catch (err) {
      alert('Failed to delete composer')
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
          {/* <CCardHeader>Composer List</CCardHeader> */}
          <CCardBody>
            <CTable bordered className="table-fixed">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell scope="col" className="col-4">
                    Name
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="col-6">
                    Full Name
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="col-2"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {/* ✅ 입력 필드 (새로운 작곡가 추가용) */}
                <CTableRow color="info">
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      placeholder="New Composer Name"
                      value={newComposer.name}
                      onChange={(e) => setNewComposer({ ...newComposer, name: e.target.value })}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      placeholder="New Composer Full Name"
                      value={newComposer.full_name}
                      onChange={(e) =>
                        setNewComposer({ ...newComposer, full_name: e.target.value })
                      }
                    />
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton color="success" variant="ghost" onClick={addComposer}>
                      <CIcon icon={cilMedicalCross} size="l" />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>

                {/* ✅ 데이터 로딩 상태 */}
                {loading && (
                  <CTableRow>
                    <CTableDataCell colSpan={3} className="text-center">
                      Loading...
                    </CTableDataCell>
                  </CTableRow>
                )}

                {/* ✅ 에러 발생 시 메시지 */}
                {error && (
                  <CTableRow>
                    <CTableDataCell colSpan={3} className="text-center text-danger">
                      {error}
                    </CTableDataCell>
                  </CTableRow>
                )}

                {/* ✅ 서버에서 가져온 작곡가 목록 */}
                {!loading &&
                  !error &&
                  composers.map((composer) =>
                    editingId === composer.id ? ( // 편집 중인 작곡가인 경우
                      <CTableRow key={composer.id} color="warning">
                        <CTableDataCell>
                          <CFormInput
                            type="text"
                            value={editedComposer.name}
                            onChange={(e) =>
                              setEditedComposer({ ...editedComposer, name: e.target.value })
                            }
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            type="text"
                            value={editedComposer.full_name}
                            onChange={(e) =>
                              setEditedComposer({ ...editedComposer, full_name: e.target.value })
                            }
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
                            onClick={() => updateComposer(composer.id)}
                          >
                            <CIcon icon={cilCheck} size="l" />
                          </CButton>
                          <CButton
                            color="danger"
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteComposer(composer.id)}
                          >
                            <CIcon icon={cilX} size="l" />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      <CTableRow key={composer.id}>
                        <CTableDataCell>{composer.name}</CTableDataCell>
                        <CTableDataCell>{composer.full_name}</CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="info"
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(composer)}
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

export default Composer
