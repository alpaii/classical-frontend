import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
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

const API_COMPOSERS = 'http://127.0.0.1:8000/api/composers/' // Composer API
const API_WORKS = 'http://127.0.0.1:8000/api/works/' // Work API

const Work = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [composers, setComposers] = useState([]) // 작곡가 목록
  const [selectedComposer, setSelectedComposer] = useState('') // 선택한 작곡가
  const [works, setWorks] = useState([]) // Work 목록

  const [addWork, setAddWork] = useState({ work_no: '', name: '' }) // 새 Work 추가 상태
  const [modalAddVisible, setModalAddVisible] = useState(false) // add new modal
  const nameAddInputRef = useRef(null) // focus

  const [updateWork, setUpdateWork] = useState({ id: '', composer: '', work_no: '', name: '' }) // 편집 중인 Work 데이터
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false) // update modal
  const nameUpdateInputRef = useRef(null) // focus

  const [deleteWork, setDeleteWork] = useState({ id: '' }) // delete
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false) // delete modal

  const [searchQuery, setSearchQuery] = useState('') // search

  useEffect(() => {
    fetchComposers()
  }, [])

  useEffect(() => {
    if (selectedComposer) {
      fetchWorks(selectedComposer)
    } else {
      setWorks([])
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
      const response = await axios.get(API_WORKS, {
        params: {
          composer: composerId,
        },
      })
      setWorks(response.data['results'])
    } catch (err) {
      setError('Failed to load works')
    } finally {
      setLoading(false)
    }
  }

  // 📌 Composer 검색 기능
  const searchWork = async (e) => {
    e.preventDefault() // 기본 폼 제출 동작 방지
    setLoading(true)

    try {
      const response = await axios.get(API_WORKS, {
        params: {
          composer: selectedComposer,
          search: searchQuery,
        },
      })
      setWorks(response.data['results'])
    } catch (err) {
      setError('Failed to search works')
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

  // 📌 새로운 Work 추가
  const runAddWork = async () => {
    if (!addWork.work_no || !addWork.name || !selectedComposer) {
      alert('Please enter all fields')
      return
    }

    try {
      await axios.post(API_WORKS, { ...addWork, composer: selectedComposer })
      fetchWorks(selectedComposer) // 목록 다시 불러오기
      setModalAddVisible(false)
      setAddWork({ work_no: '', name: '' }) // 입력 필드 초기화
    } catch (err) {
      alert('Failed to add work')
    }
  }

  // 📌 Work 수정 요청
  const runUpdateWork = async () => {
    try {
      await axios.put(`${API_WORKS}${updateWork.id}/`, updateWork)
      fetchWorks(selectedComposer) // 목록 갱신
      setModalUpdateVisible(false)
    } catch (err) {
      alert('Failed to update work')
    }
  }

  // 📌 Work 삭제 요청
  const runDeleteWork = async (id) => {
    try {
      await axios.delete(`${API_WORKS}${deleteWork.id}/`)
      fetchWorks(selectedComposer)
      setModalDeleteVisible(false)
    } catch (err) {
      alert('Failed to delete work')
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
                    <CInputGroupText>Composer</CInputGroupText>
                    <CFormSelect
                      value={selectedComposer}
                      onChange={(e) => setSelectedComposer(e.target.value)}
                    >
                      <option value="">All</option>
                      {composers.map((composer) => (
                        <option key={composer.id} value={composer.id}>
                          {composer.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CInputGroup>
                </CCol>
                <CCol xs="auto">
                  <CInputGroup>
                    <CInputGroupText>Work No.</CInputGroupText>
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
                    Add Work
                  </CButton>
                </CCol>
              </CForm>{' '}
            </CRow>
          </CCardBody>
        </CCard>
        <CCard className="mb-4 border-primary border-2">
          <CCardBody>
            <CTable bordered striped hover style={{ width: '1000px' }} className="border-info">
              <CTableHead color="info" className=" border-2">
                <CTableRow>
                  <CTableHeaderCell scope="col" className="col-3 text-center">
                    Work No
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col" className="col-5 text-center">
                    Name
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

                {/* ✅ Work 목록 */}
                {works.map((work) => (
                  <CTableRow key={work.id}>
                    <CTableDataCell className="table-cell-wrap">{work.work_no}</CTableDataCell>
                    <CTableDataCell className="table-cell-wrap">{work.name}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CButton
                        color="info"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setModalUpdateVisible(true)
                          setUpdateWork({
                            id: work.id,
                            composer: work.composer,
                            work_no: work.work_no,
                            name: work.name,
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
                          setDeleteWork({ id: work.id })
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
          <CModalTitle>Add Work</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Composer</CFormLabel>
            <CFormSelect
              value={selectedComposer}
              onChange={(e) => setSelectedComposer(e.target.value)}
              className="border border-dark"
            >
              {composers.map((composer) => (
                <option key={composer.id} value={composer.id}>
                  {composer.name}
                </option>
              ))}
            </CFormSelect>
            <CFormLabel className="mt-3">Work No.</CFormLabel>
            <CFormInput
              ref={nameAddInputRef} // ✅ `ref`를 추가하여 자동 포커스 적용
              type="text"
              value={addWork.work_no}
              onChange={(e) => setAddWork({ ...addWork, work_no: e.target.value })}
              className="border border-dark"
            />
            <CFormLabel className="mt-3">Name</CFormLabel>
            <CFormInput
              type="text"
              value={addWork.name}
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
              value={composers.find((composer) => composer.id === updateWork.composer)?.name}
              className="border border-dark bg-light"
              readOnly
            />
            <CFormLabel className="mt-3">Work No.</CFormLabel>
            <CFormInput
              ref={nameUpdateInputRef} // ✅ `ref`를 추가하여 자동 포커스 적용
              type="text"
              value={updateWork.work_no}
              onChange={(e) => setUpdateWork({ ...updateWork, work_no: e.target.value })}
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
        <CModalBody>Delete this item?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalDeleteVisible(false)}>
            Close
          </CButton>
          <CButton color="danger" onClick={runDeleteWork} className="text-white">
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Work
