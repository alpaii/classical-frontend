import React, { useEffect, useRef } from 'react'
import {
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import RoleSelect from './RoleSelect'

const AddModal = ({ visible, onClose, onSave, item, setItem }) => {
  const nameInputRef = useRef(null)

  useEffect(() => {
    if (visible) {
      setTimeout(() => nameInputRef.current?.focus(), 200) // ✅ 모달이 열리면 name 필드에 포커스
    }
  }, [visible])

  const onChangeRole = (role) => setItem({ ...item, role })

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Add Performer</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormLabel>Role</CFormLabel>
          <RoleSelect value={item.role || ''} onChange={onChangeRole} />
          <CFormLabel>Name</CFormLabel>
          <CFormInput
            ref={nameInputRef} // ✅ 자동 포커스
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
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
        <CButton color="info" onClick={onSave} className="text-white">
          Save
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default AddModal
