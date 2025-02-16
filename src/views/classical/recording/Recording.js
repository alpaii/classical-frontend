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

const API_PERFORMERS = 'http://127.0.0.1:8000/api/performers/' // Performer API
const API_COMPOSERS = 'http://127.0.0.1:8000/api/composers/' // Composer API
const API_WORKS = 'http://127.0.0.1:8000/api/works/' // Work API
const API_RECORDINGS = 'http://127.0.0.1:8000/api/recordings/' // Recording API
const API_RECORDING_DETAILS = 'http://127.0.0.1:8000/api/recording-details/' // Recording API

const Recording = () => {
  const [composers, setComposers] = useState([]) // 작곡가 목록
  const [selectedComposer, setSelectedComposer] = useState('') // 선택한 작곡가
  const [works, setWorks] = useState([]) // Work 목록
  const [selectedWork, setSelectedWork] = useState('') // 선택한 Work
  const [recordings, setRecordings] = useState([]) // Recording 목록
  const [performers, setPerformers] = useState([]) // Performer 목록
  const [newRecording, setNewRecording] = useState({ name: '', year: '', performers: [] }) // 새 Recording 추가 상태
  const [editingId, setEditingId] = useState(null) // 편집 중인 Recording ID
  const [editedRecording, setEditedRecording] = useState({ name: '', year: '', performers: [] }) // 편집 중인 Recording 데이터
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPerformers()
    fetchComposers()
  }, [])

  useEffect(() => {
    if (selectedComposer) {
      fetchWorks(selectedComposer)
    }
  }, [selectedComposer])

  useEffect(() => {
    if (selectedWork) {
      fetchRecordings(selectedWork)
    }
  }, [selectedWork])

  // 📌 Performer 목록 가져오기
  const fetchPerformers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(API_PERFORMERS)
      setPerformers(response.data['results'])
    } catch (err) {
      setError('Failed to load performers')
    } finally {
      setLoading(false)
    }
  }

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

  // 📌 선택한 Work의 Recording 목록 가져오기
  const fetchRecordings = async (workId) => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_RECORDING_DETAILS}?work=${workId}`)
      setRecordings(response.data['results'])
    } catch (err) {
      setError('Failed to load recordings')
    } finally {
      setLoading(false)
    }
  }

  // 📌 새로운 Recording 추가
  const addRecording = async () => {
    if (!newRecording.year || !selectedWork || newRecording.performers.length === 0) {
      alert('Please enter all fields')
      return
    }

    const selectedPerformerNames = newRecording.performers
      .map((id) => {
        const performer = performers.find((p) => p.id === parseInt(id))
        return performer ? performer.name : ''
      })
      .filter((name) => name)
      .join(', ')

    const selectedWorkObj = works.find((w) => w.id === parseInt(selectedWork))

    const new_name = `${newRecording.year} / ${selectedWorkObj ? selectedWorkObj.name : ''} / ${selectedPerformerNames}`

    try {
      await axios.post(API_RECORDINGS, { ...newRecording, name: new_name, work: selectedWork })
      fetchRecordings(selectedWork) // 목록 다시 불러오기
      setNewRecording({ name: '', year: '', performers: [] }) // 입력 필드 초기화
    } catch (err) {
      alert('Failed to add recording')
    }
  }

  // 📌 편집 모드 활성화
  const startEditing = (recording) => {
    setEditingId(recording.id)
    setEditedRecording({
      name: recording.name,
      year: recording.year,
      performers: recording.performers,
    })
  }

  // 📌 Recording 수정 요청
  const updateRecording = async (id) => {
    try {
      await axios.put(`${API_RECORDINGS}${id}/`, editedRecording)
      fetchRecordings(selectedWork) // 목록 갱신
      setEditingId(null)
    } catch (err) {
      alert('Failed to update recording')
    }
  }

  // 📌 Recording 삭제 요청
  const deleteRecording = async (id) => {
    try {
      await axios.delete(`${API_RECORDINGS}${id}/`)
      fetchRecordings(selectedWork)
    } catch (err) {
      alert('Failed to delete recording')
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
          <CCardHeader>Recording List</CCardHeader>
          <CCardBody>
            {/* Composer 선택 */}
            <CRow className="mb-3">
              <CFormLabel className="col-2 col-form-label">Composer</CFormLabel>
              <CCol sm={4}>
                <CFormSelect
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

            {/* Work 선택 */}
            <CRow className="mb-3">
              <CFormLabel className="col-2 col-form-label">Work</CFormLabel>
              <CCol sm={4}>
                <CFormSelect value={selectedWork} onChange={(e) => setSelectedWork(e.target.value)}>
                  <option value="">Select a Work</option>
                  {works.map((work) => (
                    <option key={work.id} value={work.id}>
                      {work.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            {/* Recording 테이블 */}
            <CTable bordered>
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell className="col-2">Year</CTableHeaderCell>
                  <CTableHeaderCell className="col-8">Performers</CTableHeaderCell>
                  <CTableHeaderCell className="col-2"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {/* ✅ Recording 추가 입력 필드 */}
                <CTableRow color="info">
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      placeholder="Year"
                      value={newRecording.year}
                      onChange={(e) => setNewRecording({ ...newRecording, year: e.target.value })}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    {/* Performer multi-select */}
                    <CFormSelect
                      multiple
                      value={newRecording.performers}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions).map(
                          (option) => option.value,
                        )
                        setNewRecording({ ...newRecording, performers: selectedOptions })
                      }}
                    >
                      {performers.map((performer) => (
                        <option key={performer.id} value={performer.id}>
                          {performer.name} - {performer.role}
                        </option>
                      ))}
                    </CFormSelect>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton color="success" variant="ghost" onClick={addRecording}>
                      <CIcon icon={cilMedicalCross} size="l" />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>

                {recordings.map((rec) =>
                  editingId === rec.id ? (
                    <CTableRow key={rec.id} color="warning">
                      <CTableDataCell>
                        <CFormInput
                          type="text"
                          value={editedRecording.year}
                          onChange={(e) =>
                            setEditedRecording({ ...editedRecording, year: e.target.value })
                          }
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormSelect
                          multiple
                          value={editedRecording.performers.map((performer) => performer.id)}
                          onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions).map(
                              (option) => option.value,
                            )
                            setEditedRecording({
                              ...editedRecording,
                              performers: selectedOptions,
                            })
                          }}
                        >
                          {performers.map((performer) => (
                            <option key={performer.id} value={performer.id}>
                              {performer.name} - {performer.role}
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
                          color="success"
                          variant="ghost"
                          onClick={() => updateRecording(rec.id)}
                        >
                          <CIcon icon={cilCheck} size="l" />
                        </CButton>
                        <CButton
                          color="danger"
                          variant="ghost"
                          onClick={() => deleteRecording(rec.id)}
                        >
                          <CIcon icon={cilX} size="l" />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    <CTableRow key={rec.id}>
                      <CTableDataCell>{rec.year}</CTableDataCell>
                      <CTableDataCell>
                        {rec.performers.map((performer) => (
                          <div key={performer.id}>
                            {performer.name} - {performer.role}
                          </div>
                        ))}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="info"
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(rec)}
                        >
                          <CIcon icon={cilPencil} />
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

export default Recording
