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

const roleOrder = [
  'Conductor',
  'Orchestra',
  'Ensemble',
  'Choir',
  'Piano',
  'Violin',
  'Cello',
  'Viola',
  'Double Bass',
  'Flute',
]

const DataTable = ({
  recordings,
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
          <CTableHeaderCell scope="col" style={{ width: '100px' }} className="text-center">
            Year
          </CTableHeaderCell>
          <CTableHeaderCell scope="col" style={{ width: '500px' }} className="text-center">
            Performers
          </CTableHeaderCell>
          <CTableHeaderCell scope="col" style={{ width: '200px' }} className="text-center">
            Actions
          </CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {recordings.map((recording) => (
          <CTableRow key={recording.id}>
            <CTableDataCell className="table-cell-wrap text-center">
              {recording.year}
            </CTableDataCell>
            <CTableDataCell className="table-cell-wrap">
              {recording.performers
                .slice()
                .sort((a, b) => roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)) // role 순서대로 정렬
                .map((performer) => (
                  <div key={performer.id}>
                    <span style={{ fontSize: '1.1em' }}>{performer.fullName}</span>{' '}
                    <span className="text-secondary fst-italic">{performer.role}</span>
                  </div>
                ))}
            </CTableDataCell>
            <CTableDataCell className="text-center">
              <CButton
                color="info"
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log('Edit:', recording)
                  setEditItem((prev) => ({ ...prev, ...recording }))
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
                  setDeleteItem(recording)
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
