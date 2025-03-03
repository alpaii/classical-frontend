import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

const FormModalFrame = ({ visible, onClose, onSave, title, children }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{children}</CModalBody>
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

export default FormModalFrame
