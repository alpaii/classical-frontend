import React, { useState } from 'react'
import {
  CForm,
  CFormInput,
  CFormLabel,
  CCol,
  CInputGroup,
  CInputGroupText,
  CCard,
  CCardBody,
  CCardFooter,
  CButton,
  CFormSelect,
  CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import { FormModalFrame, RoleSelect } from '../../commons/'

const FormModal = ({ title, visible, onClose, onSave, item, setItem }) => {
  return (
    <FormModalFrame visible={visible} onClose={onClose} onSave={onSave} title={title}>
      <CForm>
        <CFormTextarea
          className="border border-primary mb-3"
          disabled
          style={{ resize: 'none', fontSize: '1em' }}
          rows={3}
          value={`${item.composerFullName}\n${item.workNo}\n${item.workName}`}
        />
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
        <CInputGroup className="mb-3">
          <CInputGroupText className="border border-primary" style={{ width: '110px' }}>
            Work No.
          </CInputGroupText>
          <CFormInput type="text" value={item.workNo} disabled className="border border-primary" />
        </CInputGroup>
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
        <CFormLabel className="mt-3">Year</CFormLabel>
        <CFormInput
          type="text"
          value={item.year || ''}
          onChange={(e) => setItem({ ...item, year: e.target.value })}
          className="border border-primary"
        />
        <CFormLabel className="mt-3">Performer</CFormLabel>
        <CCard className="mb-2 border-primary" style={{ height: '300px' }}>
          <CCardBody></CCardBody>
          <CCardFooter>
            <CInputGroup className="mb-2 mt-2">
              <CInputGroupText className="border border-primary" style={{ width: '110px' }}>
                Role
              </CInputGroupText>
              <RoleSelect value={item.role || ''} onChange={onClose} />
            </CInputGroup>
            <CFormSelect
              multiple
              className="border border-primary mb-2"
              style={{ height: '120px' }}
            >
              <option>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
              <option value="4">Three</option>
              <option value="5">Three</option>
              <option value="6">Three</option>
            </CFormSelect>
          </CCardFooter>
        </CCard>
      </CForm>
    </FormModalFrame>
  )
}

export default FormModal
