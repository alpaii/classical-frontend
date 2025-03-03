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

const AddModal = ({ visible, onClose, onSave, item, setItem }) => {
  const nameInputRef = useRef(null)

  useEffect(() => {
    if (visible) {
      setTimeout(() => nameInputRef.current?.focus(), 200) // ✅ 모달이 열리면 name 필드에 포커스
    }
  }, [visible])

  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Add Work</CModalTitle>
      </CModalHeader>
      <CModalBody>
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
            ref={nameInputRef} // ✅ 자동 포커스
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
