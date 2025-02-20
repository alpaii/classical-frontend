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
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilX } from '@coreui/icons'
import ErrorModal from '../../../components/custom/ErrorModal' // ✅ 모달 컴포넌트 불러오기
import Pagination from '../../../components/custom/Pagination' // ✅ 페이지네이션 컴포넌트 불러오기

const API_URL = 'http://127.0.0.1:8000/api/composers/'
const PAGE_SIZE = 20

const Composer = () => {
  const [loading, setLoading] = useState(true)
  const [modalErrorVisible, setModalErrorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState({ title: '', content: '' })

  const [composers, setComposers] = useState([]) // composer list
  const [totalPageCount, setTotalPageCount] = useState(0) // 전체 페이지 개수
  const [requestPar, setRequestPar] = useState({ page: 1, search: '' }) // add new

  const [addComposer, setAddComposer] = useState({ name: '', full_name: '' }) // add new
  const [modalAddVisible, setModalAddVisible] = useState(false) // add new modal
  const nameAddInputRef = useRef(null) // focus

  const [updateComposer, setUpdateComposer] = useState({ id: '', name: '', full_name: '' }) // update
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false) // update modal
  const nameUpdateInputRef = useRef(null) // focus

  const [deleteComposer, setDeleteComposer] = useState({ id: '' }) // delete
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false) // delete modal

  const [searchQuery, setSearchQuery] = useState('') // search

  // ✅ useCallback을 사용하여 함수가 불필요하게 새로 생성되지 않도록 함
  const fetchComposers = useCallback(async () => {
    const loadingTimeout = setTimeout(() => setLoading(true), 100)
    try {
      const params = { page: requestPar.page }
      if (requestPar.search) {
        params.search = requestPar.search // ✅ search가 있을 때만 추가
      }
      const response = await axios.get(API_URL, { params })
      clearTimeout(loadingTimeout)

      setComposers(response.data.results)
      setTotalPageCount(Math.ceil(response.data.count / PAGE_SIZE))
    } catch (err) {
      clearTimeout(loadingTimeout)
      setErrorMessage({
        title: 'Failed to load composers',
        content: err.message,
      })
      setModalErrorVisible(true)
    } finally {
      setLoading(false)
    }
  }, [requestPar]) // ✅ useCallback에 의존성 추가

  // 📌 서버에서 데이터 가져오기
  useEffect(() => {
    fetchComposers()
  }, [fetchComposers])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPageCount) return // 페이지 범위 초과 방지
    setRequestPar((prev) => ({ ...prev, page }))
  }

  // 📌 Composer 검색 기능
  const searchComposer = async (e) => {
    e.preventDefault() // 기본 폼 제출 동작 방지
    setRequestPar({ page: 1, search: searchQuery.trim() }) // 페이지 번호 변경
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

  // 📌 새 작곡가 추가 함수
  const runAddComposer = async () => {
    if (!addComposer.name || !addComposer.full_name) {
      alert('Please enter both name and full name')
      return
    }

    try {
      const response = await axios.post(API_URL, addComposer) // 서버에 추가 요청
      fetchComposers() // 다시 불러오기
      setModalAddVisible(false)
      setAddComposer({ name: '', full_name: '' }) // 입력 필드 초기화
    } catch (err) {
      setErrorMessage({
        title: 'Failed to add composers',
        content: err.message,
      })
      setModalErrorVisible(true)
    }
  }

  // 📌 편집 내용 저장 (업데이트)
  const runUpdateComposer = async () => {
    try {
      await axios.put(`${API_URL}${updateComposer.id}/`, updateComposer) // Django API에 PUT 요청
      fetchComposers() // 목록 갱신
      setModalUpdateVisible(false)
    } catch (err) {
      setErrorMessage({
        title: 'Failed to update composers',
        content: err.message,
      })
      setModalErrorVisible(true)
    }
  }

  // 📌 편집 데이터 삭제 (delete)
  const runDeleteComposer = async () => {
    try {
      await axios.delete(`${API_URL}${deleteComposer.id}/`) // Django API에 PUT 요청
      fetchComposers() // 목록 갱신
      setModalDeleteVisible(false)
    } catch (err) {
      setErrorMessage({
        title: 'Failed to delete composers',
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
              <CForm className="row ms-2 gy-1 gx-3 align-items-center" onSubmit={searchComposer}>
                <CCol xs="auto">
                  <CInputGroup>
                    <CInputGroupText>Composer</CInputGroupText>
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
                    Add Composer
                  </CButton>
                </CCol>
              </CForm>{' '}
            </CRow>
          </CCardBody>
        </CCard>
        <CCard className="mb-4 border-primary border-2">
          <CCardBody>
            <CTable bordered striped hover style={{ width: 'auto' }} className="border-success">
              <CTableHead color="success" className="border-2">
                <CTableRow>
                  <CTableHeaderCell scope="col" style={{ width: '300px' }} className="text-center">
                    Name
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" style={{ width: '500px' }} className="text-center">
                    Full Name
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
                    <CTableDataCell colSpan={3} className="text-center">
                      Loading...
                    </CTableDataCell>
                  </CTableRow>
                )}
                {/* ✅ 서버에서 가져온 작곡가 목록 */}
                {!loading &&
                  composers.map((composer) => (
                    <CTableRow key={composer.id}>
                      <CTableDataCell className="table-cell-wrap">{composer.name}</CTableDataCell>
                      <CTableDataCell className="table-cell-wrap">
                        {composer.full_name}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CButton
                          color="info"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setModalUpdateVisible(true)
                            setUpdateComposer({
                              id: composer.id,
                              name: composer.name,
                              full_name: composer.full_name,
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
                            setDeleteComposer({ id: composer.id })
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
          <CModalTitle>Add Composer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Name</CFormLabel>
            <CFormInput
              ref={nameAddInputRef} // ✅ `ref`를 추가하여 자동 포커스 적용
              type="text"
              value={addComposer.name}
              onChange={(e) => setAddComposer({ ...addComposer, name: e.target.value })}
              className="border border-dark"
            />
            <CFormLabel className="mt-3">Full Name</CFormLabel>
            <CFormInput
              type="text"
              value={addComposer.full_name}
              onChange={(e) => setAddComposer({ ...addComposer, full_name: e.target.value })}
              className="border border-dark"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalAddVisible(false)}>
            Close
          </CButton>
          <CButton color="info" onClick={runAddComposer} className="text-white">
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* ✅ Edit 모달 창 추가 */}
      <CModal visible={modalUpdateVisible} onClose={() => setModalUpdateVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Composer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Name</CFormLabel>
            <CFormInput
              ref={nameUpdateInputRef} // ✅ `ref`를 추가하여 자동 포커스 적용
              type="text"
              value={updateComposer.name}
              onChange={(e) => setUpdateComposer({ ...updateComposer, name: e.target.value })}
              className="border border-dark"
            />
            <CFormLabel className="mt-3">Full Name</CFormLabel>
            <CFormInput
              type="text"
              value={updateComposer.full_name}
              onChange={(e) => setUpdateComposer({ ...updateComposer, full_name: e.target.value })}
              className="border border-dark"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalUpdateVisible(false)}>
            Close
          </CButton>
          <CButton color="info" onClick={runUpdateComposer} className="text-white">
            Save
          </CButton>
        </CModalFooter>
      </CModal>

      {/* 삭제 확인 모달 */}
      <CModal visible={modalDeleteVisible} onClose={() => setModalDeleteVisible(false)}>
        <CModalBody>Delete this item?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalDeleteVisible(false)}>
            Close
          </CButton>
          <CButton color="danger" onClick={runDeleteComposer} className="text-white">
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

export default Composer
