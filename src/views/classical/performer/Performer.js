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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilX, cilCheck, cilMedicalCross, cilReload } from '@coreui/icons'

const API_URL = 'http://127.0.0.1:8000/api/performers/' // ✅ Performer API URL

const ROLE_CHOICES = [
  'Conductor',
  'Orchestra',
  'Ensemble',
  'Choir',
  'Piano',
  'Violin',
  'Cello',
  'Viola',
  'Double Bass',
  'Flute',
]

const Performer = () => {
  const [performers, setPerformers] = useState([]) // 연주자 목록
  const [newPerformer, setNewPerformer] = useState({ name: '', full_name: '', role: 'Conductor' }) // 새 연주자 입력
  const [editingId, setEditingId] = useState(null) // 현재 편집 중인 연주자 ID
  const [editedPerformer, setEditedPerformer] = useState({ name: '', full_name: '', role: '' }) // 편집 중인 데이터
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPerformers()
  }, [])

  const fetchPerformers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_URL)
      setPerformers(response.data['results'])
    } catch (err) {
      setError('Failed to load performers')
    } finally {
      setLoading(false)
    }
  }

  // 📌 새 Performer 추가
  const addPerformer = async () => {
    if (!newPerformer.name || !newPerformer.full_name) {
      alert('Please enter both name and full name')
      return
    }

    try {
      await axios.post(API_URL, newPerformer)
      fetchPerformers()
      setNewPerformer({ name: '', full_name: '', role: 'Conductor' }) // 입력 필드 초기화
    } catch (err) {
      alert('Failed to add performer')
    }
  }

  // 📌 편집 모드 활성화
  const startEditing = (performer) => {
    setEditingId(performer.id)
    setEditedPerformer({
      name: performer.name,
      full_name: performer.full_name,
      role: performer.role,
    })
  }

  // 📌 편집 내용 저장 (업데이트)
  const updatePerformer = async (id) => {
    try {
      await axios.put(`${API_URL}${id}/`, editedPerformer) // API 요청
      fetchPerformers()
      setEditingId(null) // 편집 종료
    } catch (err) {
      alert('Failed to update performer')
    }
  }

  // 📌 Performer 삭제
  const deletePerformer = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`) // API 요청
      fetchPerformers()
    } catch (err) {
      alert('Failed to delete performer')
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
          <CCardHeader>Performer List</CCardHeader>
          <CCardBody>
            <CTable bordered className="table-fixed">
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell className="col-3">Name</CTableHeaderCell>
                  <CTableHeaderCell className="col-4">Full Name</CTableHeaderCell>
                  <CTableHeaderCell className="col-3">Role</CTableHeaderCell>
                  <CTableHeaderCell className="col-2"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {/* ✅ 새 Performer 추가 입력 필드 */}
                <CTableRow color="info">
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      placeholder="New Performer Name"
                      value={newPerformer.name}
                      onChange={(e) => setNewPerformer({ ...newPerformer, name: e.target.value })}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      placeholder="New Performer Full Name"
                      value={newPerformer.full_name}
                      onChange={(e) =>
                        setNewPerformer({ ...newPerformer, full_name: e.target.value })
                      }
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CFormSelect
                      value={newPerformer.role}
                      onChange={(e) => setNewPerformer({ ...newPerformer, role: e.target.value })}
                    >
                      {ROLE_CHOICES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </CFormSelect>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton color="success" variant="ghost" onClick={addPerformer}>
                      <CIcon icon={cilMedicalCross} size="l" />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>

                {/* ✅ 서버에서 가져온 Performer 목록 */}
                {performers.map((performer) =>
                  editingId === performer.id ? (
                    <CTableRow key={performer.id} color="warning">
                      <CTableDataCell>
                        <CFormInput
                          type="text"
                          value={editedPerformer.name}
                          onChange={(e) =>
                            setEditedPerformer({ ...editedPerformer, name: e.target.value })
                          }
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          type="text"
                          value={editedPerformer.full_name}
                          onChange={(e) =>
                            setEditedPerformer({ ...editedPerformer, full_name: e.target.value })
                          }
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormSelect
                          value={editedPerformer.role}
                          onChange={(e) =>
                            setEditedPerformer({ ...editedPerformer, role: e.target.value })
                          }
                        >
                          {ROLE_CHOICES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </CFormSelect>
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
                          onClick={() => updatePerformer(performer.id)}
                        >
                          <CIcon icon={cilCheck} size="l" />
                        </CButton>
                        <CButton
                          color="danger"
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePerformer(performer.id)}
                        >
                          <CIcon icon={cilX} size="l" />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    <CTableRow key={performer.id}>
                      <CTableDataCell>{performer.name}</CTableDataCell>
                      <CTableDataCell>{performer.full_name}</CTableDataCell>
                      <CTableDataCell>{performer.role}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="info"
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(performer)}
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

export default Performer
