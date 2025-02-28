import React, { useState } from 'react'
import { CButton, CCol, CForm, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import RoleSelect from './RoleSelect'

const SearchForm = ({ requestPar, setAddItem, setRequestPar, setModalAddVisible }) => {
  const [searchRole, setSearchRole] = useState(requestPar.searchRole)
  const [searchFullName, setSearchFullName] = useState(requestPar.searchFullName)

  // 📌 검색 기능
  const search = async (e) => {
    e.preventDefault() // 기본 폼 제출 동작 방지
    setRequestPar({ page: 1, searchRole, searchFullName }) // 검색어 적용, 페이지 초기화
  }

  return (
    <CForm className="row ms-2 gy-1 gx-3 align-items-center" onSubmit={search}>
      <CCol xs="auto">
        <CInputGroup>
          <CInputGroupText className="border border-primary">Role</CInputGroupText>
          <RoleSelect value={searchRole} onChange={setSearchRole} />
        </CInputGroup>
      </CCol>
      <CCol xs="auto">
        <CInputGroup>
          <CInputGroupText className="border border-primary">Performer</CInputGroupText>
          <CFormInput
            type="text"
            value={searchFullName}
            onChange={(e) => setSearchFullName(e.target.value.trim())}
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
          onClick={() => {
            setAddItem({})
            setModalAddVisible(true)
          }}
        >
          <CIcon icon={cilPlus} size="l" className="me-2" />
          Add Performer
        </CButton>
      </CCol>
    </CForm>
  )
}

export default SearchForm
