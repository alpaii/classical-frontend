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
import { convertSnakeToCamel } from '../../../utils/formatters' // ✅ 유틸 함수 가져오기

const API_WORKS = 'http://127.0.0.1:8000/api/works/' // Work API
const PAGE_SIZE = 20

const Work = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // location.state
  const composerInfo = location.state?.composerInfo ?? {}
  const requestParWork = location.state?.requestParWork ?? {}

  // search parameter
  const [requestPar, setRequestPar] = useState({
    page: requestParWork.page || 1,
    composerId: composerInfo.id || 1,
    workNo: requestParWork.workNo || '',
    name: requestParWork.name || '',
  })

  // search inputbox
  const [searchWorkNo, setSearchWorkNo] = useState(requestPar.workNo) // search
  const [searchName, setSearchName] = useState(requestPar.name) // search

  const [loading, setLoading] = useState(true)
  const [modalErrorVisible, setModalErrorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState({})

  const [works, setWorks] = useState([]) // Work 목록
  const [totalPageCount, setTotalPageCount] = useState(0) // 전체 페이지 개수

  const [addWork, setAddWork] = useState({}) // 새 Work 추가 상태
  const [modalAddVisible, setModalAddVisible] = useState(false) // add new modal
  const nameAddInputRef = useRef(null) // focus

  const [updateWork, setUpdateWork] = useState({}) // 편집 중인 Work 데이터
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false) // update modal
  const nameUpdateInputRef = useRef(null) // focus

  const [deleteWork, setDeleteWork] = useState() // delete
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false) // delete modal

  // 📌 선택한 Composer의 Work 목록 가져오기
  const fetchWorks = useCallback(async () => {
    const loadingTimeout = setTimeout(() => setLoading(true), 100)
    try {
      const response = await axios.get(API_WORKS, {
        params: {
          page: requestPar.page,
          composer_id: requestPar.composerId,
          work_no: requestPar.workNo,
          name: requestPar.name,
        },
      })
      clearTimeout(loadingTimeout)
      setWorks(convertSnakeToCamel(response.data.results))
      setTotalPageCount(Math.ceil(response.data.count / PAGE_SIZE))
    } catch (err) {
      clearTimeout(loadingTimeout)
      setErrorMessage({
        title: 'Failed to load work',
        content: err.message,
      })
      setModalErrorVisible(true)
    } finally {
      setLoading(false)
    }
  }, [requestPar]) // ✅ useCallback에 의존성 추가

  useEffect(() => {
    fetchWorks()
  }, [fetchWorks])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPageCount) return // 페이지 범위 초과 방지
    setRequestPar((prev) => ({ ...prev, page }))
  }

  // 📌 Work 검색 기능
  const searchWork = async (e) => {
    e.preventDefault() // 기본 폼 제출 동작 방지
    setRequestPar((prev) => ({
      ...prev,
      page: 1,
      workNo: searchWorkNo,
      name: searchName,
    }))
  }

  // 📌 Add 모달이 열릴 때 name input에 자동 포커스
  useEffect(() => {
    if (modalAddVisible) {
      setTimeout(() => nameAddInputRef.current?.focus(), 200) // ✅ 모달이 열리면 name 필드에 포커스
    }
  }, [modalAddVisible])

  // 📌 Edit 모달이 열릴 때 name input에 자동 포커스
  useEffect(() => {
    if (modalUpdateVisible) {
      setTimeout(() => nameUpdateInputRef.current?.focus(), 200) // ✅ 모달이 열리면 name 필드에 포커스
    }
  }, [modalUpdateVisible])

  // 📌 새로운 Work 추가
  const runAddWork = async () => {
    if (!addWork.workNo || !addWork.name || !composerInfo.id) {
      alert('Please enter all fields')
      return
    }

    try {
      await axios.post(API_WORKS, {
        composer: composerInfo.id,
        work_no: addWork.workNo,
        name: addWork.name,
      })
      fetchWorks() // 목록 다시 불러오기
      setModalAddVisible(false)
      setAddWork({ workNo: '', name: '' }) // 입력 필드 초기화
    } catch (err) {
      setErrorMessage({
        title: 'Failed to add work',
        content: err.message,
      })
      setModalErrorVisible(true)
    }
  }

  // 📌 Work 수정 요청
  const runUpdateWork = async () => {
    try {
      await axios.put(`${API_WORKS}${updateWork.id}/`, {
        work_no: updateWork.workNo,
        name: updateWork.name,
      })
      fetchWorks() // 목록 갱신
      setModalUpdateVisible(false)
    } catch (err) {
      setErrorMessage({
        title: 'Failed to update work',
        content: err.message,
      })
      setModalErrorVisible(true)
    }
  }

  // 📌 Work 삭제 요청
  const runDeleteWork = async () => {
    try {
      await axios.delete(`${API_WORKS}${deleteWork.id}/`)
      fetchWorks()
      setModalDeleteVisible(false)
    } catch (err) {
      setErrorMessage({
        title: 'Failed to delete work',
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
              <CForm className="row ms-2 gy-1 gx-3 align-items-center" onSubmit={searchWork}>
                <CCol xs="auto">
                  <CInputGroup>
                    <CInputGroupText className="border border-primary">Composer</CInputGroupText>
                    <CFormInput
                      type="text"
                      value={composerInfo.fullName}
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
                      value={searchWorkNo}
                      onChange={(e) => setSearchWorkNo(e.target.value)}
                      className="border border-primary"
                    />
                  </CInputGroup>
                </CCol>
                <CCol xs="auto">
                  <CInputGroup>
                    <CInputGroupText className="border border-primary">Name</CInputGroupText>
                    <CFormInput
                      type="text"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="border border-primary"
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
                    Add Work
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
              navigate('/classical/composer', {
                state: location.state,
              })
            }}
          >
            <CIcon icon={cilChevronLeft} size="l" className="me-2" />
            Back to Composer
          </CButton>
        </CCol>

        <CCard className="mb-4 border-primary border-2">
          <CCardBody>
            <CTable bordered striped hover style={{ width: 'auto' }} className="border-success">
              <CTableHead color="success" className=" border-2">
                <CTableRow>
                  <CTableHeaderCell scope="col" style={{ width: '200px' }} className="text-center">
                    Work No
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '500px' }} className="text-center">
                    Name
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '200px' }} className="text-center">
                    Recording Count
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
                {/* ✅ Work 목록 */}
                {!loading &&
                  works.map((work) => (
                    <CTableRow key={work.id}>
                      <CTableDataCell className="table-cell-wrap">{work.workNo}</CTableDataCell>
                      <CTableDataCell className="table-cell-wrap">{work.name}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {work.recordingCount === 0 ? (
                          '-'
                        ) : (
                          <CButton
                            color="warning"
                            size="sm"
                            onClick={() => {
                              navigate('/classical/recording', {
                                state: {
                                  ...location.state,
                                  composerInfo: composerInfo,
                                  requestParWork: requestPar,
                                },
                              })
                            }}
                            className="p-0"
                            style={{ width: '50px', textAlign: 'center' }} // ✅ 버튼 크기 고정
                          >
                            <span style={{ fontSize: '1.1rem' }}>{work.recordingCount}</span>
                          </CButton>
                        )}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="info"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setModalUpdateVisible(true)
                            setUpdateWork(work)
                          }}
                          className="hover-white me-2"
                        >
                          <CIcon icon={cilPencil} size="l" />
                        </CButton>
                        <CButton
                          color="danger"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteWork(work)
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
        <CModalBody>
          <CForm>
            <CFormLabel>Composer</CFormLabel>
            <CFormInput
              type="text"
              disabled
              value={composerInfo.fullName}
              className="border border-dark"
            />
            <CFormLabel className="mt-3">Work No.</CFormLabel>
            <CFormInput
              ref={nameAddInputRef} // ✅ `ref`를 추가하여 자동 포커스 적용
              type="text"
              value={addWork.workNo || ''}
              onChange={(e) => setAddWork({ ...addWork, workNo: e.target.value })}
              className="border border-dark"
            />
            <CFormLabel className="mt-3">Name</CFormLabel>
            <CFormInput
              type="text"
              value={addWork.name || ''}
              onChange={(e) => setAddWork({ ...addWork, name: e.target.value })}
              className="border border-dark"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalAddVisible(false)}>
            Close
          </CButton>
          <CButton color="info" onClick={runAddWork} className="text-white">
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ✅ Edit 모달 창 추가 */}
      <CModal visible={modalUpdateVisible} onClose={() => setModalUpdateVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Work</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Composer</CFormLabel>
            <CFormInput
              type="text"
              disabled
              value={composerInfo.fullName}
              className="border border-dark"
            />
            <CFormLabel className="mt-3">Work No.</CFormLabel>
            <CFormInput
              ref={nameUpdateInputRef} // ✅ `ref`를 추가하여 자동 포커스 적용
              type="text"
              value={updateWork.workNo}
              onChange={(e) => setUpdateWork({ ...updateWork, workNo: e.target.value })}
              className="border border-dark"
            />
            <CFormLabel className="mt-3">Name</CFormLabel>
            <CFormInput
              type="text"
              value={updateWork.name}
              onChange={(e) => setUpdateWork({ ...updateWork, name: e.target.value })}
              className="border border-dark"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalUpdateVisible(false)}>
            Close
          </CButton>
          <CButton color="info" onClick={runUpdateWork} className="text-white">
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
          <div className="mt-2">Are you sure to delete this work?</div>
          <div className="mb-5 mt-5 text-danger text-center">
            <div className="mb-3">
              <strong>{composerInfo.fullName}</strong>
            </div>
            <div className="mb-3">
              <strong>{deleteWork?.workNo || ''}</strong>
            </div>
            <div>
              <strong>{deleteWork?.name || ''}</strong>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalDeleteVisible(false)}>
            Close
          </CButton>
          <CButton color="danger" onClick={runDeleteWork} className="text-white">
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

export default Work
