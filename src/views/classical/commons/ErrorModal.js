import React from 'react'
import { CModal, CModalHeader, CModalBody, CModalFooter, CButton } from '@coreui/react'

const ErrorModal = ({ visible, onClose, message }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>{message.title}</CModalHeader>
      <CModalBody>{message.content}</CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default ErrorModal
