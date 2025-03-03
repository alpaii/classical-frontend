import React from 'react'
import { CForm, CFormInput, CFormLabel } from '@coreui/react'
import { FormModalFrame } from '../../commons/'

const FormModal = ({ title, visible, onClose, onSave, item, setItem }) => {
  return (
    <FormModalFrame visible={visible} onClose={onClose} onSave={onSave} title={title}>
      <CForm>
        <CFormLabel>Composer</CFormLabel>
        <CFormInput
          type="text"
          disabled
          value={item.composerFullName || ''}
          className="border border-dark"
        />
        <CFormLabel className="mt-3">Work No</CFormLabel>
        <CFormInput
          type="text"
          value={item.workNo || ''}
          onChange={(e) => setItem((prev) => ({ ...prev, workNo: e.target.value }))}
          className="border border-dark"
        />
        <CFormLabel className="mt-3">Name</CFormLabel>
        <CFormInput
          type="text"
          value={item.name || ''}
          onChange={(e) => setItem((prev) => ({ ...prev, name: e.target.value }))}
          className="border border-dark"
        />
      </CForm>
    </FormModalFrame>
  )
}

export default FormModal
