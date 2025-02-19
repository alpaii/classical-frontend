import React from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'

const ErrorModal = ({ visible, onClose, title, content }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>{title}</CModalHeader>
      <CModalBody>{content}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ErrorModal
