import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CRow, CCol, CCard, CCardBody } from '@coreui/react'

import { ErrorModal, Pagination, DeleteModal } from '../commons'
import { SearchForm, DataTable, FormModal } from './components'
import { fetchList, runAddItem, runEditItem, runDeleteItem } from './api'

const Composer = () => {
  // location.state
  const location = useLocation()
  const requestParComposer = location.state?.requestParComposer ?? {}

  // search parameter
  const [requestPar, setRequestPar] = useState({
    page: requestParComposer.page || 1,
    searchFullName: requestParComposer.searchFullName || '',
  })

  // search
  const [composers, setComposers] = useState([])
  const [totalPageCount, setTotalPageCount] = useState(0)

  // add modal
  const [addItem, setAddItem] = useState({})
  const [modalAddVisible, setModalAddVisible] = useState(false)

  // edit modal
  const [editItem, setEditItem] = useState({})
  const [modalEditVisible, setModalEditVisible] = useState(false)

  // delete modal
  const [deleteItem, setDeleteItem] = useState()
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false)

  // error modal
  const [errorMessage, setErrorMessage] = useState({})
  const [modalErrorVisible, setModalErrorVisible] = useState(false)

  useEffect(() => {
    fetchList(requestPar, setComposers, setTotalPageCount, setErrorMessage)
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
                requestPar={requestPar}
                setRequestPar={setRequestPar}
                setAddItem={setAddItem}
                setModalAddVisible={setModalAddVisible}
              />
            </CRow>
          </CCardBody>
        </CCard>
        <CCard className="mb-4 border-primary border-2">
          <CCardBody>
            <DataTable
              composers={composers}
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
        title="Add Composer"
        visible={modalAddVisible}
        onClose={() => setModalAddVisible(false)}
        onSave={() => runAddItem(addItem, setModalAddVisible, setRequestPar, setErrorMessage)}
        item={addItem}
        setItem={setAddItem}
      />

      <FormModal
        title="Edit Composer"
        visible={modalEditVisible}
        onClose={() => setModalEditVisible(false)}
        onSave={() => runEditItem(editItem, setModalEditVisible, setRequestPar, setErrorMessage)}
        item={editItem}
        setItem={setEditItem}
      />

      <DeleteModal
        title="Delete Composer"
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

export default Composer
