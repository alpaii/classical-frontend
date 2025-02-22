import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilX, cilChevronLeft } from '@coreui/icons'
import ErrorModal from '../../../components/custom/ErrorModal' // ✅ 모달 컴포넌트 불러오기
import Pagination from '../../../components/custom/Pagination' // ✅ 페이지네이션 컴포넌트 불러오기

// const API_PERFORMERS = 'http://127.0.0.1:8000/api/performers/' // Performer API
// const API_COMPOSERS = 'http://127.0.0.1:8000/api/composers/' // Composer API
// const API_WORKS = 'http://127.0.0.1:8000/api/works/' // Work API
// const API_RECORDINGS = 'http://127.0.0.1:8000/api/recordings/' // Recording API
const API_RECORDING_DETAILS = 'http://127.0.0.1:8000/api/recording-details/' // Recording API
const PAGE_SIZE = 20

const Recording = () => {
  const navigate = useNavigate() // ✅ 페이지 이동 함수
  const location = useLocation()
  const workId = location.state?.workId || null
  const workNo = location.state?.workNo || null
  const workName = location.state?.workName || null
  const workComposer = location.state?.workComposer || null
  const workPage = location.state?.workPage || null
  const workSearchWorkNo = location.state?.workSearchWorkNo || null
  const workSearchName = location.state?.workSearchName || null

  const [loading, setLoading] = useState(true)
  const [modalErrorVisible, setModalErrorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState({ title: '', content: '' })

  const [recordings, setRecordings] = useState([]) // Recording 목록
  const [totalPageCount, setTotalPageCount] = useState(0) // 전체 페이지 개수
  const [requestPar, setRequestPar] = useState({
    page: workPage,
  })
  const [addRecording, setAddRecording] = useState({ work_no: '', name: '' }) // 새 Recording 추가 상태
  const [modalAddVisible, setModalAddVisible] = useState(false) // add new modal
  const nameAddInputRef = useRef(null) // focus

  const [updateRecording, setUpdateRecording] = useState({
    id: '',
    composer: '',
    work_no: '',
    name: '',
  }) // 편집 중인 Recording 데이터
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false) // update modal
  const nameUpdateInputRef = useRef(null) // focus

  const [deleteRecording, setDeleteRecording] = useState({ id: '' }) // delete
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false) // delete modal

  // 📌 선택한 Work의 Recording 목록 가져오기
  const fetchRecordings = useCallback(async () => {
    const loadingTimeout = setTimeout(() => setLoading(true), 100)
    try {
      const param = { page: requestPar.page, work: workId }
      const response = await axios.get(API_RECORDING_DETAILS, { params: param })
      clearTimeout(loadingTimeout)

      setRecordings(response.data.results)
    } catch (err) {
      clearTimeout(loadingTimeout)
      setErrorMessage({
        title: 'Failed to load recording',
        content: err.message,
      })
      setModalErrorVisible(true)
    } finally {
      setLoading(false)
    }
  }, [workId])

  useEffect(() => {
    fetchRecordings()
  }, [fetchRecordings])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPageCount) return // 페이지 범위 초과 방지
    setRequestPar((prev) => ({ ...prev, page }))
  }

  // 📌 Work 검색 기능
  const searchRecording = async (e) => {
    e.preventDefault() // 기본 폼 제출 동작 방지
    setRequestPar((prev) => ({
      ...prev,
      page: 1,
    }))
  }

  // 📌 새로운 Recording 추가
  const runAddRecording = async () => {
    // if (!newRecording.year || !selectedWork || newRecording.performers.length === 0) {
    //   alert('Please enter all fields')
    //   return
    // }
    // const selectedPerformerNames = newRecording.performers
    //   .map((id) => {
    //     const performer = performers.find((p) => p.id === parseInt(id))
    //     return performer ? performer.name : ''
    //   })
    //   .filter((name) => name)
    //   .join(', ')
    // const selectedWorkObj = works.find((w) => w.id === parseInt(selectedWork))
    // const new_name = `${newRecording.year} / ${selectedWorkObj ? selectedWorkObj.name : ''} / ${selectedPerformerNames}`
    // try {
    //   await axios.post(API_RECORDINGS, { ...newRecording, name: new_name, work: selectedWork })
    //   fetchRecordings(selectedWork) // 목록 다시 불러오기
    //   setNewRecording({ name: '', year: '', performers: [] }) // 입력 필드 초기화
    // } catch (err) {
    //   alert('Failed to add recording')
    // }
  }

  // 📌 Recording 수정 요청
  const runUpdateRecording = async (id) => {
    // try {
    //   await axios.put(`${API_RECORDINGS}${id}/`, editedRecording)
    //   fetchRecordings(selectedWork) // 목록 갱신
    //   setEditingId(null)
    // } catch (err) {
    //   alert('Failed to update recording')
    // }
  }

  // 📌 Recording 삭제 요청
  const runDeleteRecording = async () => {
    try {
      await axios.delete(`${API_RECORDINGS}${deleteRecording.id}/`)
      fetchRecordings()
      setModalDeleteVisible(false)
    } catch (err) {
      setErrorMessage({
        title: 'Failed to delete recording',
        content: err.message,
      })
      setModalErrorVisible(true)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 border-primary bg-primary-light">
          <CCardBody>
            <CRow>
              <CForm className="row ms-2 gy-1 gx-3 align-items-center" onSubmit={searchRecording}>
                <CCol xs="auto">
                  <CInputGroup>
                    <CInputGroupText className="border border-primary">Composer</CInputGroupText>
                    <CFormInput
                      type="text"
                      value={workComposer}
                      disabled
                      className="border border-primary"
                      style={{ width: '300px' }}
                    />
                  </CInputGroup>
                </CCol>
                <CCol xs="auto">
                  <CInputGroup>
                    <CInputGroupText className="border border-primary">Work No.</CInputGroupText>
                    <CFormInput
                      type="text"
                      value={workNo}
                      disabled
                      className="border border-primary"
                      style={{ width: '200px' }}
                    />
                  </CInputGroup>
                </CCol>
                <CCol xs="auto">
                  <CInputGroup>
                    <CInputGroupText className="border border-primary">Name</CInputGroupText>
                    <CFormInput
                      type="text"
                      value={workName}
                      disabled
                      className="border border-primary"
                      style={{ width: '400px' }}
                    />
                  </CInputGroup>
                </CCol>

                <CCol xs="auto">
                  <CButton color="primary" type="submit">
                    Search
                  </CButton>
                </CCol>
                <CCol xs="auto" className="ms-auto me-4">
                  <CButton
                    color="info"
                    className="text-white"
                    onClick={() => setModalAddVisible(true)}
                  >
                    <CIcon icon={cilPlus} size="l" className="me-2" />
                    Add Recording
                  </CButton>
                </CCol>
              </CForm>{' '}
            </CRow>
          </CCardBody>
        </CCard>

        <CCol xs="auto" className="ms-2 mb-2">
          <CButton
            color="info"
            className="text-white"
            onClick={() => {
              navigate('/classical/work', {
                state: {
                  workPage,
                  workSearchWorkNo,
                  workSearchName,
                },
              })
            }}
          >
            <CIcon icon={cilChevronLeft} size="l" className="me-2" />
            Back to Work
          </CButton>
        </CCol>

        <CCard className="mb-4 border-primary border-2">
          <CCardBody>
            {/* Recording 테이블 */}
            <CTable bordered striped hover style={{ width: 'auto' }} className="border-success">
              <CTableHead color="success" className=" border-2">
                <CTableRow>
                  <CTableHeaderCell scope="col" style={{ width: '200px' }} className="text-center">
                    Year
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '500px' }} className="text-center">
                    Performers
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '200px' }} className="text-center">
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {/* ✅ 데이터 로딩 상태 */}
                {loading && (
                  <CTableRow>
                    <CTableDataCell colSpan={4} className="text-center">
                      Loading...
                    </CTableDataCell>
                  </CTableRow>
                )}

                {!loading &&
                  recordings.map((rec) => (
                    <CTableRow key={rec.id}>
                      <CTableDataCell className="text-center">{rec.year}</CTableDataCell>
                      <CTableDataCell>
                        {rec.performers.map((performer) => (
                          <div key={performer.id}>
                            {performer.name} - {performer.role}
                          </div>
                        ))}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton color="info" size="sm" variant="ghost">
                          <CIcon icon={cilPencil} />
                        </CButton>
                        <CButton
                          color="danger"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteRecording(rec)
                            setModalDeleteVisible(true)
                          }}
                          className="hover-white"
                        >
                          <CIcon icon={cilX} size="l" />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
              </CTableBody>
            </CTable>
            <CRow>
              <CCol xs="auto">
                {/* ✅ 페이지네이션 추가 */}
                <Pagination
                  currentPage={requestPar.page}
                  totalPageCount={totalPageCount}
                  onPageChange={handlePageChange}
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>

      {/* ✅ Add 모달 창 추가 */}
      <CModal visible={modalAddVisible} onClose={() => setModalAddVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add Work</CModalTitle>
        </CModalHeader>
        <CModalBody></CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalAddVisible(false)}>
            Close
          </CButton>
          <CButton color="info" onClick={runAddRecording} className="text-white">
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ✅ Edit 모달 창 추가 */}
      <CModal visible={modalUpdateVisible} onClose={() => setModalUpdateVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Work</CModalTitle>
        </CModalHeader>
        <CModalBody></CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalUpdateVisible(false)}>
            Close
          </CButton>
          <CButton color="info" onClick={runUpdateRecording} className="text-white">
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* 삭제 확인 모달 */}
      <CModal visible={modalDeleteVisible} onClose={() => setModalDeleteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete Work</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mt-2">Are you sure to delete this recording?</div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalDeleteVisible(false)}>
            Close
          </CButton>
          <CButton color="danger" onClick={runDeleteRecording} className="text-white">
            Delete
          </CButton>
        </CModalFooter>
      </CModal>

      {/* 오류 모달 */}
      <ErrorModal
        visible={modalErrorVisible}
        onClose={() => setModalErrorVisible(false)}
        title={errorMessage.title}
        content={errorMessage.content}
      />
    </CRow>
  )
}

export default Recording
