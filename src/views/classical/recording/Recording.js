import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation, Form } from 'react-router-dom'
import { CRow, CCol, CCard, CCardBody, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChevronLeft } from '@coreui/icons'

import { ErrorModal, Pagination, DeleteModal } from '../commons'
import { SearchForm, DataTable, FormModal } from './components'
import { fetchList, runAddItem, runEditItem, runDeleteItem } from './api'

const Recording = () => {
  const navigate = useNavigate()

  // location.state
  const location = useLocation()
  const composerInfo = location.state?.composerInfo ?? {}
  const workInfo = location.state?.workInfo ?? {}
  const requestParRecording = location.state?.requestParRecording ?? {}

  // search parameter
  const [requestPar, setRequestPar] = useState({
    page: requestParRecording.page || 1,
    composerId: composerInfo.id || 0,
    composerFullName: composerInfo.fullName || '',
    workId: workInfo.id || '',
    workNo: workInfo.workNo || '',
    workName: workInfo.name || '',
  })

  // search
  const [recordings, setRecordings] = useState([])
  const [totalPageCount, setTotalPageCount] = useState(0)

  // add modal
  const [addItem, setAddItem] = useState({
    composerId: composerInfo.id,
    composerFullName: composerInfo.fullName,
    workId: workInfo.id,
    workNo: workInfo.workNo,
    workName: workInfo.name,
  })
  const [modalAddVisible, setModalAddVisible] = useState(false)

  // edit modal
  const [editItem, setEditItem] = useState({
    composerId: composerInfo.id,
    composerFullName: composerInfo.fullName,
    workId: workInfo.id,
    workNo: workInfo.workNo,
    workName: workInfo.name,
  })
  const [modalEditVisible, setModalEditVisible] = useState(false)

  // delete modal
  const [deleteItem, setDeleteItem] = useState()
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false)

  // error modal
  const [errorMessage, setErrorMessage] = useState({})
  const [modalErrorVisible, setModalErrorVisible] = useState(false)

  useEffect(() => {
    fetchList(requestPar, setRecordings, setTotalPageCount, setErrorMessage)
  }, [requestPar])

  useEffect(() => {
    if (Object.keys(errorMessage).length === 0) return
    setModalErrorVisible(true)
  }, [errorMessage])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 border-primary bg-primary-light">
          <CCardBody>
            <CRow>
              <SearchForm
                composerInfo={composerInfo}
                workInfo={workInfo}
                requestPar={requestPar}
                setRequestPar={setRequestPar}
                setAddItem={setAddItem}
                setModalAddVisible={setModalAddVisible}
              />
            </CRow>
          </CCardBody>
        </CCard>

        <CCol xs="auto" className="ms-2 mb-2">
          <CButton
            color="info"
            className="text-white"
            onClick={() => {
              navigate('/classical/work', {
                state: location.state,
              })
            }}
          >
            <CIcon icon={cilChevronLeft} size="l" className="me-2" />
            Back to Work
          </CButton>
        </CCol>

        <CCard className="mb-4 border-primary border-2">
          <CCardBody>
            <DataTable
              recordings={recordings}
              requestPar={requestPar}
              setEditItem={setEditItem}
              setModalEditVisible={setModalEditVisible}
              setDeleteItem={setDeleteItem}
              setModalDeleteVisible={setModalDeleteVisible}
            />{' '}
            <CRow>
              <CCol xs="auto">
                <Pagination
                  currentPage={requestPar.page}
                  totalPageCount={totalPageCount}
                  setRequestPar={setRequestPar}
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>

      <FormModal
        title="Add Recording"
        visible={modalAddVisible}
        onClose={() => setModalAddVisible(false)}
        onSave={() => runAddItem(addItem, setModalAddVisible, setRequestPar, setErrorMessage)}
        item={addItem}
        setItem={setAddItem}
      />

      <FormModal
        title="Edit Recording"
        visible={modalEditVisible}
        onClose={() => setModalEditVisible(false)}
        onSave={() => runEditItem(editItem, setModalEditVisible, setRequestPar, setErrorMessage)}
        item={editItem}
        setItem={setEditItem}
      />

      <DeleteModal
        title="Delete Recording"
        visible={modalDeleteVisible}
        onClose={() => setModalDeleteVisible(false)}
        onDelete={() =>
          runDeleteItem(deleteItem, setModalDeleteVisible, setRequestPar, setErrorMessage)
        }
        item={deleteItem}
      />

      <ErrorModal
        visible={modalErrorVisible}
        onClose={() => setModalErrorVisible(false)}
        message={errorMessage}
      />
    </CRow>
  )
}

export default Recording
