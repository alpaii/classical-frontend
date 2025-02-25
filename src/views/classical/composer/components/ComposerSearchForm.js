import React from 'react'
import { CButton, CCol, CForm, CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'

const ComposerSearchForm = ({
  searchFullName,
  setSearchFullName,
  searchComposer,
  setModalAddVisible,
}) => {
  return (
    <CForm className="row ms-2 gy-1 gx-3 align-items-center" onSubmit={searchComposer}>
      <CCol xs="auto">
        <CInputGroup>
          <CInputGroupText className="border border-primary">Composer</CInputGroupText>
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
        <CButton color="info" className="text-white" onClick={() => setModalAddVisible(true)}>
          <CIcon icon={cilPlus} size="l" className="me-2" />
          Add Composer
        </CButton>
      </CCol>
    </CForm>
  )
}

export default ComposerSearchForm
