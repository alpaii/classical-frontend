import React, { useEffect, useState, useRef, useCallback } from 'react'
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
  CFormSelect,
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
import { cilPlus, cilPencil, cilX, cilCheck, cilMedicalCross, cilReload } from '@coreui/icons'
import ErrorModal from '../../../components/custom/ErrorModal' // ✅ 모달 컴포넌트 불러오기
import Pagination from '../../../components/custom/Pagination' // ✅ 페이지네이션 컴포넌트 불러오기

const API_URL = 'http://127.0.0.1:8000/api/performers/' // ✅ Performer API URL
const PAGE_SIZE = 20

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
  const [loading, setLoading] = useState(true)
  const [modalErrorVisible, setModalErrorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState({ title: '', content: '' })

  const [performers, setPerformers] = useState([]) // 연주자 목록
  const [totalPageCount, setTotalPageCount] = useState(0) // 전체 페이지 개수
  const [requestPar, setRequestPar] = useState({ page: 1, search: '' }) // add new

  const [addPerformer, setAddPerformer] = useState({ name: '', full_name: '', role: 'Conductor' }) // 새 연주자 입력
  const [modalAddVisible, setModalAddVisible] = useState(false) // add new modal
  const nameAddInputRef = useRef(null) // focus

  const [updatePerformer, setUpdatePerformer] = useState({ id: '', name: '', full_name: '' }) // update
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false) // update modal
  const nameUpdateInputRef = useRef(null) // focus

  const [deletePerformer, setDeletePerformer] = useState() // delete
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false) // delete modal

  const [selectedRole, setSelectedRole] = useState('') // 선택한 Role
  const [searchQuery, setSearchQuery] = useState('') // search

  // ✅ useCallback을 사용하여 함수가 불필요하게 새로 생성되지 않도록 함
  const fetchPerformers = useCallback(async () => {
    const loadingTimeout = setTimeout(() => setLoading(true), 100)
    try {
      const params = { page: requestPar.page }
      if (requestPar.search) {
        params.search = requestPar.search // ✅ search가 있을 때만 추가
      }
      if (requestPar.role) {
        params.role = requestPar.role // ✅ role이 있을 때만 추가
      }
      const response = await axios.get(API_URL, { params })
      clearTimeout(loadingTimeout)

      setPerformers(response.data.results)
      setTotalPageCount(Math.ceil(response.data.count / PAGE_SIZE))
    } catch (err) {
      clearTimeout(loadingTimeout)
      setErrorMessage({
        title: 'Failed to load performers',
        content: err.message,
      })
      setModalErrorVisible(true)
    } finally {
      setLoading(false)
    }
  }, [requestPar]) // ✅ useCallback에 의존성 추가

  useEffect(() => {
    fetchPerformers()
  }, [fetchPerformers])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPageCount) return // 페이지 범위 초과 방지
    setRequestPar((prev) => ({ ...prev, page }))
  }

  // 📌 Performer 검색 기능
  const searchPerformer = async (e) => {
    e.preventDefault() // 기본 폼 제출 동작 방지
    setRequestPar({ page: 1, search: searchQuery.trim(), role: selectedRole }) // 페이지 번호 변경
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

  // 📌 새 Performer 추가
  const runAddPerformer = async () => {
    if (!addPerformer.name || !addPerformer.full_name) {
      alert('Please enter both name and full name')
      return
    }

    try {
      await axios.post(API_URL, addPerformer)
      fetchPerformers()
      setModalAddVisible(false)
      setAddPerformer({ name: '', full_name: '', role: 'Conductor' }) // 입력 필드 초기화
    } catch (err) {
      setErrorMessage({
        title: 'Failed to add performers',
        content: err.message,
      })
      setModalErrorVisible(true)
    }
  }

  // 📌 편집 내용 저장 (업데이트)
  const runUpdatePerformer = async () => {
    try {
      await axios.put(`${API_URL}${updatePerformer.id}/`, updatePerformer) // API 요청
      fetchPerformers()
      setModalUpdateVisible(false)
    } catch (err) {
      setErrorMessage({
        title: 'Failed to update performer',
        content: err.message,
      })
      setModalErrorVisible(true)
    }
  }

  // 📌 Performer 삭제
  const runDeletePerformer = async () => {
    try {
      await axios.delete(`${API_URL}${deletePerformer.id}/`) // API 요청
      fetchPerformers()
      setModalDeleteVisible(false)
    } catch (err) {
      setErrorMessage({
        title: 'Failed to delete performers',
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
              <CForm className="row ms-2 gy-1 gx-3 align-items-center" onSubmit={searchPerformer}>
                <CCol xs="auto">
                  <CInputGroup>
                    <CInputGroupText className="border border-primary">Role</CInputGroupText>
                    <CFormSelect
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="border border-primary"
                    >
                      <option value="">All</option>
                      {ROLE_CHOICES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                </CCol>
                <CCol xs="auto">
                  <CInputGroup>
                    <CInputGroupText className="border border-primary">Performer</CInputGroupText>
                    <CFormInput
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                    Add Performer
                  </CButton>
                </CCol>
              </CForm>{' '}
            </CRow>
          </CCardBody>
        </CCard>
        <CCard className="mb-4 border-primary border-2">
          <CCardBody>
            <CTable bordered striped hover style={{ width: 'auto' }} className="border-info">
              <CTableHead color="info" className=" border-2">
                <CTableRow>
                  <CTableHeaderCell scope="col" style={{ width: '300px' }} className="text-center">
                    Name
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '500px' }} className="text-center">
                    Full Name
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '200px' }} className="text-center">
                    Role
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
                {/* ✅ 서버에서 가져온 Performer 목록 */}
                {performers.map((performer) => (
                  <CTableRow key={performer.id}>
                    <CTableDataCell className="table-cell-wrap">{performer.name}</CTableDataCell>
                    <CTableDataCell className="table-cell-wrap">
                      {performer.full_name}
                    </CTableDataCell>
                    <CTableDataCell className="text-center">{performer.role}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="info"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setModalUpdateVisible(true)
                          setUpdatePerformer({
                            id: performer.id,
                            name: performer.name,
                            full_name: performer.full_name,
                            role: performer.role,
                          })
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
                          setDeletePerformer(performer)
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
          <CModalTitle>Add Performer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Role</CFormLabel>
            <CFormSelect
              value={addPerformer.role}
              onChange={(e) => setAddPerformer({ ...addPerformer, role: e.target.value })}
              className="border border-dark"
            >
              {ROLE_CHOICES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </CFormSelect>
            <CFormLabel className="mt-3">Name</CFormLabel>
            <CFormInput
              ref={nameAddInputRef} // ✅ `ref`를 추가하여 자동 포커스 적용
              type="text"
              value={addPerformer.name}
              onChange={(e) => setAddPerformer({ ...addPerformer, name: e.target.value })}
              className="border border-dark"
            />
            <CFormLabel className="mt-3">Full Name</CFormLabel>
            <CFormInput
              type="text"
              value={addPerformer.full_name}
              onChange={(e) => setAddPerformer({ ...addPerformer, full_name: e.target.value })}
              className="border border-dark"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalAddVisible(false)}>
            Close
          </CButton>
          <CButton color="info" onClick={runAddPerformer} className="text-white">
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ✅ Edit 모달 창 추가 */}
      <CModal visible={modalUpdateVisible} onClose={() => setModalUpdateVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Performer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Role</CFormLabel>
            <CFormSelect
              value={updatePerformer.role}
              onChange={(e) => setUpdatePerformer({ ...updatePerformer, role: e.target.value })}
              className="border border-dark"
            >
              {ROLE_CHOICES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </CFormSelect>
            <CFormLabel className="mt-3">Name</CFormLabel>
            <CFormInput
              ref={nameUpdateInputRef} // ✅ `ref`를 추가하여 자동 포커스 적용
              type="text"
              value={updatePerformer.name}
              onChange={(e) => setUpdatePerformer({ ...updatePerformer, name: e.target.value })}
              className="border border-dark"
            />
            <CFormLabel className="mt-3">Full Name</CFormLabel>
            <CFormInput
              type="text"
              value={updatePerformer.full_name}
              onChange={(e) =>
                setUpdatePerformer({ ...updatePerformer, full_name: e.target.value })
              }
              className="border border-dark"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalUpdateVisible(false)}>
            Close
          </CButton>
          <CButton color="info" onClick={runUpdatePerformer} className="text-white">
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* 삭제 확인 모달 */}
      <CModal visible={modalDeleteVisible} onClose={() => setModalDeleteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete Composer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="mt-2">Are you sure to delete this performer?</div>
          <div className="mb-5 mt-5 text-danger text-center">
            <strong>{deletePerformer?.full_name || ''}</strong>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalDeleteVisible(false)}>
            Close
          </CButton>
          <CButton color="danger" onClick={runDeletePerformer} className="text-white">
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

export default Performer
