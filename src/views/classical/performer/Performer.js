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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [performers, setPerformers] = useState([]) // 연주자 목록
  const [selectedRole, setSelectedRole] = useState('') // 선택한 작곡가

  const [addPerformer, setAddPerformer] = useState({ name: '', full_name: '', role: 'Conductor' }) // 새 연주자 입력
  const [modalAddVisible, setModalAddVisible] = useState(false) // add new modal
  const nameAddInputRef = useRef(null) // focus

  const [updatePerformer, setUpdatePerformer] = useState({ id: '', name: '', full_name: '' }) // update
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false) // update modal
  const nameUpdateInputRef = useRef(null) // focus

  const [deletePerformer, setDeletePerformer] = useState({ id: '' }) // delete
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false) // delete modal

  const [searchQuery, setSearchQuery] = useState('') // search

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

  // 📌 Performer 검색 기능
  const searchPerformer = async (e) => {
    e.preventDefault() // 기본 폼 제출 동작 방지
    setLoading(true)

    try {
      console.log('selectedRole:', selectedRole)
      const response = await axios.get(API_URL, {
        params: { role: selectedRole, search: searchQuery },
      })
      setPerformers(response.data['results'])
    } catch (err) {
      setError('Failed to search performers')
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
      alert('Failed to add performer')
    }
  }

  // 📌 편집 내용 저장 (업데이트)
  const runUpdatePerformer = async () => {
    try {
      await axios.put(`${API_URL}${updatePerformer.id}/`, updatePerformer) // API 요청
      fetchPerformers()
      setModalUpdateVisible(false)
    } catch (err) {
      alert('Failed to update performer')
    }
  }

  // 📌 Performer 삭제
  const runDeletePerformer = async () => {
    try {
      await axios.delete(`${API_URL}${deletePerformer.id}/`) // API 요청
      fetchPerformers()
      setModalDeleteVisible(false)
    } catch (err) {
      alert('Failed to delete performer')
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
                    <CInputGroupText>Role</CInputGroupText>
                    <CFormSelect
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="border border-dark"
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
                    <CInputGroupText>Performer</CInputGroupText>
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

                {/* ✅ 에러 발생 시 메시지 */}
                {error && (
                  <CTableRow>
                    <CTableDataCell colSpan={4} className="text-center text-danger">
                      {error}
                    </CTableDataCell>
                  </CTableRow>
                )}

                {/* ✅ 서버에서 가져온 Performer 목록 */}
                {performers.map((performer) => (
                  <CTableRow key={performer.id}>
                    <CTableDataCell>{performer.name}</CTableDataCell>
                    <CTableDataCell>{performer.full_name}</CTableDataCell>
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
                          setDeletePerformer({ id: performer.id })
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
          <CModalTitle>Add Performer</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel>Name</CFormLabel>
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
            <CFormLabel className="mt-3">Role</CFormLabel>
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
            <CFormLabel>Name</CFormLabel>
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
          <CFormLabel className="mt-3">Role</CFormLabel>
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
        <CModalBody>Delete this item?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalDeleteVisible(false)}>
            Close
          </CButton>
          <CButton color="danger" onClick={runDeletePerformer} className="text-white">
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Performer
