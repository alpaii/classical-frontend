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
  composers,
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
          <CTableHeaderCell scope="col" style={{ width: '150px' }} className="text-center">
            Work Count
          </CTableHeaderCell>
          <CTableHeaderCell scope="col" style={{ width: '200px' }} className="text-center">
            Actions
          </CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {composers.map((composer) => (
          <CTableRow key={composer.id}>
            <CTableDataCell className="table-cell-wrap">{composer.name}</CTableDataCell>
            <CTableDataCell className="table-cell-wrap">{composer.fullName}</CTableDataCell>
            <CTableDataCell className="text-center">
              {composer.workCount === 0 ? (
                '-'
              ) : (
                <CButton
                  color="warning"
                  size="sm"
                  onClick={() => {
                    navigate('/classical/work', {
                      state: {
                        composerInfo: composer,
                        requestParComposer: requestPar,
                      },
                    })
                  }}
                  className="p-0"
                  style={{ width: '50px', textAlign: 'center' }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{composer.workCount}</span>
                </CButton>
              )}
            </CTableDataCell>
            <CTableDataCell className="text-center">
              <CButton
                color="info"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditItem(composer)
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
                  setDeleteItem(composer)
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
