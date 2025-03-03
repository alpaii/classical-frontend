import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CRow, CCol, CCard, CCardBody, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChevronLeft } from '@coreui/icons'

import { ErrorModal, Pagination } from '../commons'
import { SearchForm, DataTable, AddModal, EditModal, DeleteModal } from './components'
import { fetchList, runAddItem, runEditItem, runDeleteItem } from './api'

const Work = () => {
  const navigate = useNavigate()

  // location.state
  const location = useLocation()
  const composerInfo = location.state?.composerInfo ?? {}
  const requestParWork = location.state?.requestParWork ?? {}

  // search parameter
  const [requestPar, setRequestPar] = useState({
    page: requestParWork.page || 1,
    composerId: composerInfo.id || 0,
    composerFullName: composerInfo.fullName || '',
    searchWorkNo: requestParWork.searchWorkNo || '',
    searchName: requestParWork.searchName || '',
  })

  // search
  const [works, setWorks] = useState([])
  const [totalPageCount, setTotalPageCount] = useState(0)

  // add modal
  const [addItem, setAddItem] = useState({
    composerId: composerInfo.id,
    composerFullName: composerInfo.fullName,
  })
  const [modalAddVisible, setModalAddVisible] = useState(false)

  // edit modal
  const [editItem, setEditItem] = useState({
    composerId: composerInfo.id,
    composerFullName: composerInfo.fullName,
  })
  const [modalEditVisible, setModalEditVisible] = useState(false)

  // delete modal
  const [deleteItem, setDeleteItem] = useState()
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false)

  // error modal
  const [errorMessage, setErrorMessage] = useState({})
  const [modalErrorVisible, setModalErrorVisible] = useState(false)

  useEffect(() => {
    fetchList(requestPar, setWorks, setTotalPageCount, setErrorMessage)
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
              navigate('/classical/composer', {
                state: location.state,
              })
            }}
          >
            <CIcon icon={cilChevronLeft} size="l" className="me-2" />
            Back to Composer
          </CButton>
        </CCol>

        <CCard className="mb-4 border-primary border-2">
          <CCardBody>
            <DataTable
              works={works}
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

      <AddModal
        visible={modalAddVisible}
        onClose={() => setModalAddVisible(false)}
        onSave={() => runAddItem(addItem, setModalAddVisible, setRequestPar, setErrorMessage)}
        item={addItem}
        setItem={setAddItem}
      />

      <EditModal
        visible={modalEditVisible}
        onClose={() => setModalEditVisible(false)}
        onSave={() => runEditItem(editItem, setModalEditVisible, setRequestPar, setErrorMessage)}
        item={editItem}
        setItem={setEditItem}
      />

      <DeleteModal
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

export default Work
