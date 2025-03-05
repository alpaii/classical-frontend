import React, { useState } from 'react'
import { CButton, CCol, CForm, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'

const SearchForm = ({
  composerInfo,
  workInfo,
  requestPar,
  setAddItem,
  setRequestPar,
  setModalAddVisible,
}) => {
  // const [searchWorkNo, setSearchWorkNo] = useState(requestPar.searchWorkNo)
  // const [searchName, setSearchName] = useState(requestPar.searchName)

  // 📌 검색 기능
  const search = async (e) => {
    e.preventDefault() // 기본 폼 제출 동작 방지
    setRequestPar((prev) => ({ ...prev, page: 1, workId: workInfo.id })) // 검색어 적용, 페이지 초기화
  }

  return (
    <CForm className="row ms-2 gy-1 gx-3 align-items-center" onSubmit={search}>
      <CCol style={{ flex: 'none', width: '400px' }}>
        <CInputGroup>
          <CInputGroupText className="border border-primary">Composer</CInputGroupText>
          <CFormInput
            type="text"
            value={composerInfo.fullName}
            disabled
            className="border border-primary"
          />
        </CInputGroup>
      </CCol>
      <CCol xs="auto">
        <CInputGroup>
          <CInputGroupText className="border border-primary">Work No.</CInputGroupText>
          <CFormInput
            type="text"
            value={workInfo.workNo}
            disabled
            className="border border-primary"
          />
        </CInputGroup>
      </CCol>
      <CCol style={{ flex: 'none', width: '400px' }}>
        <CInputGroup>
          <CInputGroupText className="border border-primary">Work Name</CInputGroupText>
          <CFormInput
            type="text"
            value={workInfo.name}
            disabled
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
            setAddItem((prev) => ({ ...prev }))
            setModalAddVisible(true)
          }}
        >
          <CIcon icon={cilPlus} size="l" className="me-2" />
          Add Recording
        </CButton>
      </CCol>
    </CForm>
  )
}

export default SearchForm
