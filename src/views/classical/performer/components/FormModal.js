import React from 'react'
import { CForm, CFormInput, CFormLabel } from '@coreui/react'
import { FormModalFrame, RoleSelect } from '../../commons/'

const FormModal = ({ visible, onClose, onSave, item, setItem }) => {
  const onChangeRole = (role) => setItem({ ...item, role })

  return (
    <FormModalFrame visible={visible} onClose={onClose} onSave={onSave} title="Add Performer">
      <CForm>
        <CFormLabel>Role</CFormLabel>
        <RoleSelect value={item.role || ''} onChange={onChangeRole} />
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
