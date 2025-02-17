import React, { useEffect, useState, useRef } from 'react'
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
import { cilPlus, cilPencil, cilX } from '@coreui/icons'
// import { set } from '@core-js/core/dict'

const API_URL = 'http://127.0.0.1:8000/api/composers/'

const Composer = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [composers, setComposers] = useState([]) // composer list

  const [addComposer, setAddComposer] = useState({ name: '', full_name: '' }) // add new
  const [modalAddVisible, setModalAddVisible] = useState(false) // add new modal
  const nameAddInputRef = useRef(null) // focus

  const [updateComposer, setUpdateComposer] = useState({ id: '', name: '', full_name: '' }) // update
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false) // update modal
  const nameUpdateInputRef = useRef(null) // focus

  const [deleteComposer, setDeleteComposer] = useState({ id: '' }) // delete
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false) // delete modal

  const [searchQuery, setSearchQuery] = useState('') // search

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

  // 📌 Composer 검색 기능
  const searchComposer = async (e) => {
    e.preventDefault() // 기본 폼 제출 동작 방지
    setLoading(true)

    try {
      const response = await axios.get(`${API_URL}?search=${searchQuery}`)
      setComposers(response.data)
    } catch (err) {
      setError('Failed to search composers')
    } finally {
      setLoading(false)
    }
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
      alert('Failed to add composer')
    }
  }

  // 📌 편집 내용 저장 (업데이트)
  const runUpdateComposer = async () => {
    try {
      await axios.put(`${API_URL}${updateComposer.id}/`, updateComposer) // Django API에 PUT 요청
      fetchComposers() // 목록 갱신
      setModalUpdateVisible(false)
    } catch (err) {
      alert('Failed to update composer')
    }
  }

  // 📌 편집 데이터 삭제 (delete)
  const runDeleteComposer = async () => {
    try {
      await axios.delete(`${API_URL}${deleteComposer.id}/`) // Django API에 PUT 요청
      fetchComposers() // 목록 갱신
      setModalDeleteVisible(false)
    } catch (err) {
      alert('Failed to delete composer')
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
                  <CFormLabel>Composer</CFormLabel>
                </CCol>
                <CCol xs="auto">
                  <CFormInput
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-primary"
                  />
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
            <CTable bordered striped hover style={{ width: '1000px' }} className="border-info">
              <CTableHead color="primary" className=" border-2">
                <CTableRow>
                  <CTableHeaderCell scope="col" className="col-4 text-center">
                    Name
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="col-6 text-center">
                    Full Name
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="col-2 text-center">
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
                  composers.map((composer) => (
                    <CTableRow key={composer.id}>
                      <CTableDataCell>{composer.name}</CTableDataCell>
                      <CTableDataCell>{composer.full_name}</CTableDataCell>
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
    </CRow>
  )
}

export default Composer
