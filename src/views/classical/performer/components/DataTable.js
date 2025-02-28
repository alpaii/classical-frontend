import React from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilX } from '@coreui/icons'

const DataTable = ({
  performers,
  requestPar,
  setEditItem,
  setModalEditVisible,
  setDeleteItem,
  setModalDeleteVisible,
}) => {
  const navigate = useNavigate()

  return (
    <CTable bordered striped hover style={{ width: 'auto' }} className="border-success">
      <CTableHead color="success" className="border-2">
        <CTableRow>
          <CTableHeaderCell scope="col" style={{ width: '300px' }} className="text-center">
            Name
          </CTableHeaderCell>
          <CTableHeaderCell scope="col" style={{ width: '500px' }} className="text-center">
            Full Name
          </CTableHeaderCell>
          <CTableHeaderCell scope="col" style={{ width: '200px' }} className="text-center">
            Role
          </CTableHeaderCell>
          <CTableHeaderCell scope="col" style={{ width: '200px' }} className="text-center">
            Recording Count
          </CTableHeaderCell>
          <CTableHeaderCell scope="col" style={{ width: '200px' }} className="text-center">
            Actions
          </CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {performers.map((performer) => (
          <CTableRow key={performer.id}>
            <CTableDataCell className="table-cell-wrap">{performer.name}</CTableDataCell>
            <CTableDataCell className="table-cell-wrap">{performer.fullName}</CTableDataCell>
            <CTableDataCell className="text-center">{performer.role}</CTableDataCell>
            <CTableDataCell className="text-center">
              {performer.recording_count === 0 ? (
                '-'
              ) : (
                <CButton
                  color="warning"
                  size="sm"
                  onClick={() => {
                    navigate('/classical/recording', {
                      state: {
                        performerInfo: performer,
                        requestParPerformer: requestPar,
                      },
                    })
                  }}
                  className="p-0"
                  style={{ width: '50px', textAlign: 'center' }} // ✅ 버튼 크기 고정
                >
                  <span style={{ fontSize: '1.1rem' }}>{performer.recordingCount}</span>
                </CButton>
              )}
            </CTableDataCell>

            <CTableDataCell className="text-center">
              <CButton
                color="info"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditItem(performer)
                  setModalEditVisible(true)
                }}
                className="hover-white me-2"
              >
                <CIcon icon={cilPencil} size="l" />
              </CButton>
              <CButton
                color="danger"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteItem(performer)
                  setModalDeleteVisible(true)
                }}
                className="hover-white"
              >
                <CIcon icon={cilX} size="l" />
              </CButton>
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}

export default DataTable
