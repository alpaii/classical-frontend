import React from 'react'
import {
  CForm,
  CFormInput,
  CFormLabel,
  CCol,
  CInputGroup,
  CInputGroupText,
  CCard,
  CCardBody,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { FormModalFrame } from '../../commons/'

const FormModal = ({ title, visible, onClose, onSave, item, setItem }) => {
  return (
    <FormModalFrame visible={visible} onClose={onClose} onSave={onSave} title={title}>
      <CForm>
        <CCol>
          <CInputGroup className="mb-3">
            <CInputGroupText className="border border-primary" style={{ width: '110px' }}>
              Composer
            </CInputGroupText>
            <CFormInput
              type="text"
              value={item.composerFullName}
              disabled
              className="border border-primary"
            />
          </CInputGroup>
        </CCol>
        <CCol xs="auto">
          <CInputGroup className="mb-3">
            <CInputGroupText className="border border-primary" style={{ width: '110px' }}>
              Work No.
            </CInputGroupText>
            <CFormInput
              type="text"
              value={item.workNo}
              disabled
              className="border border-primary"
            />
          </CInputGroup>
        </CCol>
        <CCol>
          <CInputGroup>
            <CInputGroupText className="border border-primary" style={{ width: '110px' }}>
              Work Name
            </CInputGroupText>
            <CFormInput
              type="text"
              value={item.workName}
              disabled
              className="border border-primary"
            />
          </CInputGroup>
        </CCol>
        <CCol>
          <CFormLabel className="mt-3">Year</CFormLabel>
          <CFormInput
            type="text"
            value={item.year || ''}
            onChange={(e) => setItem({ ...item, year: e.target.value })}
            className="border border-primary"
          />
        </CCol>
        <CCol>
          <CFormLabel className="mt-3">Performer</CFormLabel>
          <CCard className="mb-2 border-primary" style={{ height: '100px' }}>
            <CCardBody></CCardBody>
          </CCard>
        </CCol>
        <CButton size="sm" color="success" className="text-white">
          <CIcon icon={cilPlus} size="l" className="me-2" />
          Add Performer
        </CButton>
      </CForm>
    </FormModalFrame>
  )
}

export default FormModal
