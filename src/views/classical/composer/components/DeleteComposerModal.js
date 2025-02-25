import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

const DeleteComposerModal = ({ visible, onClose, onDelete, composer }) => {
  return (
    <CModal visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>Delete Composer</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="mt-2">Are you sure you want to delete this composer?</div>
        <div className="mb-5 mt-5 text-danger text-center">
          <strong>{composer?.fullName || ''}</strong>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Close
        </CButton>
        <CButton color="danger" onClick={onDelete} className="text-white">
          Delete
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DeleteComposerModal
