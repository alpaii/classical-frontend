import React from 'react'
import { CForm, CFormInput, CFormLabel } from '@coreui/react'
import { FormModalFrame } from '../../commons/'

const FormModal = ({ title, visible, onClose, onSave, item, setItem }) => {
  return (
    <FormModalFrame visible={visible} onClose={onClose} onSave={onSave} title={title}>
      <CForm>
        <CFormLabel>Name</CFormLabel>
        <CFormInput
          type="text"
          value={item.name || ''}
          onChange={(e) => setItem({ ...item, name: e.target.value })}
          className="border border-dark"
        />
        <CFormLabel className="mt-3">Full Name</CFormLabel>
        <CFormInput
          type="text"
          value={item.fullName || ''}
          onChange={(e) => setItem({ ...item, fullName: e.target.value })}
          className="border border-dark"
        />
      </CForm>
    </FormModalFrame>
  )
}

export default FormModal
