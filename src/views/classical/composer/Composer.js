import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { CRow, CCol, CCard, CCardBody } from '@coreui/react'

import ErrorModal from '../modals/ErrorModal' // ✅ 모달 컴포넌트 불러오기
import Pagination from '../modals/Pagination' // ✅ 페이지네이션 컴포넌트 불러오기

import ComposerSearchForm from './components/ComposerSearchForm'
import ComposerTable from './components/ComposerTable'
import AddComposerModal from './components/AddComposerModal'
import EditComposerModal from './components/EditComposerModal'
import DeleteComposerModal from './components/DeleteComposerModal'

import { convertSnakeToCamel } from '../../../utils/formatters' // ✅ 유틸 함수 가져오기

const API_URL = 'http://127.0.0.1:8000/api/composers/'
const PAGE_SIZE = 20

const Composer = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // location.state
  const requestParComposer = location.state?.requestParComposer ?? {}

  // search parameter
  const [requestPar, setRequestPar] = useState({
    page: requestParComposer.page || 1,
    searchFullName: requestParComposer.searchFullName || '',
  })

  // search inputbox
  const [searchFullName, setSearchFullName] = useState(requestPar.searchFullName) // search

  const [loading, setLoading] = useState(true)
  const [modalErrorVisible, setModalErrorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState({})

  const [composers, setComposers] = useState([]) // composer list
  const [totalPageCount, setTotalPageCount] = useState(0) // 전체 페이지 개수

  const [addComposer, setAddComposer] = useState({}) // add new
  const [modalAddVisible, setModalAddVisible] = useState(false) // add new modal

  const [updateComposer, setUpdateComposer] = useState({}) // update
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false) // update modal

  const [deleteComposer, setDeleteComposer] = useState() // delete
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false) // delete modal

  // ✅ useCallback을 사용하여 함수가 불필요하게 새로 생성되지 않도록 함
  const fetchComposers = useCallback(async () => {
    const loadingTimeout = setTimeout(() => setLoading(true), 100)
    try {
      const response = await axios.get(API_URL, {
        params: {
          page: requestPar.page,
          full_name: requestPar.searchFullName,
        },
      })
      clearTimeout(loadingTimeout)
      setComposers(convertSnakeToCamel(response.data.results))
      setTotalPageCount(Math.ceil(response.data.count / PAGE_SIZE))
    } catch (err) {
      clearTimeout(loadingTimeout)
      setErrorMessage({
        title: 'Failed to load composers',
        content: err.message,
      })
      setModalErrorVisible(true)
    } finally {
      setLoading(false)
    }
  }, [requestPar]) // ✅ useCallback에 의존성 추가

  // 📌 서버에서 데이터 가져오기
  useEffect(() => {
    fetchComposers()
  }, [fetchComposers])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPageCount) return // 페이지 범위 초과 방지
    setRequestPar((prev) => ({ ...prev, page }))
  }

  // 📌 Composer 검색 기능
  const searchComposer = async (e) => {
    e.preventDefault() // 기본 폼 제출 동작 방지
    setRequestPar({ page: 1, searchFullName }) // 검색어 적용, 페이지 초기화
  }

  // 📌 새 작곡가 추가 함수
  const runAddComposer = async () => {
    if (!addComposer.name || !addComposer.fullName) {
      alert('Please enter both name and full name')
      return
    }

    try {
      const response = await axios.post(API_URL, {
        name: addComposer.name,
        full_name: addComposer.fullName,
      })
      fetchComposers() // 다시 불러오기
      setModalAddVisible(false)
      setAddComposer({ name: '', fullName: '' }) // 입력 필드 초기화
    } catch (err) {
      setErrorMessage({
        title: 'Failed to add composers',
        content: err.message,
      })
      setModalErrorVisible(true)
    }
  }

  // 📌 편집 내용 저장 (업데이트)
  const runUpdateComposer = async () => {
    try {
      await axios.put(`${API_URL}${updateComposer.id}/`, {
        name: updateComposer.name,
        full_name: updateComposer.fullName,
      })
      fetchComposers() // 목록 갱신
      setModalUpdateVisible(false)
    } catch (err) {
      setErrorMessage({
        title: 'Failed to update composers',
        content: err.message,
      })
      setModalErrorVisible(true)
    }
  }

  // 📌 편집 데이터 삭제 (delete)
  const runDeleteComposer = async () => {
    try {
      await axios.delete(`${API_URL}${deleteComposer.id}/`) // Django API에 PUT 요청
      fetchComposers() // 목록 갱신
      setModalDeleteVisible(false)
    } catch (err) {
      setErrorMessage({
        title: 'Failed to delete composers',
        content: err.message,
      })
      setModalErrorVisible(true)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 border-primary bg-primary-light">
          <CCardBody>
            <CRow>
              <ComposerSearchForm
                searchFullName={searchFullName}
                setSearchFullName={setSearchFullName}
                searchComposer={searchComposer}
                setModalAddVisible={setModalAddVisible}
              />
            </CRow>
          </CCardBody>
        </CCard>
        <CCard className="mb-4 border-primary border-2">
          <CCardBody>
            <ComposerTable
              composers={composers}
              loading={loading}
              requestPar={requestPar}
              navigate={navigate}
              setUpdateComposer={setUpdateComposer}
              setModalUpdateVisible={setModalUpdateVisible}
              setDeleteComposer={setDeleteComposer}
              setModalDeleteVisible={setModalDeleteVisible}
            />{' '}
            <CRow>
              <CCol xs="auto">
                {/* ✅ 페이지네이션 추가 */}
                <Pagination
                  currentPage={requestPar.page}
                  totalPageCount={totalPageCount}
                  onPageChange={handlePageChange}
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>

      {/* ✅ Add 모달 창 추가 */}
      <AddComposerModal
        visible={modalAddVisible}
        onClose={() => setModalAddVisible(false)}
        onSave={runAddComposer}
        composer={addComposer}
        setComposer={setAddComposer}
      />

      {/* ✅ Edit 모달 창 추가 */}
      <EditComposerModal
        visible={modalUpdateVisible}
        onClose={() => setModalUpdateVisible(false)}
        onSave={runUpdateComposer}
        composer={updateComposer}
        setComposer={setUpdateComposer}
      />

      {/* 삭제 확인 모달 */}
      <DeleteComposerModal
        visible={modalDeleteVisible}
        onClose={() => setModalDeleteVisible(false)}
        onDelete={runDeleteComposer}
        composer={deleteComposer}
      />

      {/* 오류 모달 */}
      <ErrorModal
        visible={modalErrorVisible}
        onClose={() => setModalErrorVisible(false)}
        title={errorMessage.title}
        content={errorMessage.content}
      />
    </CRow>
  )
}

export default Composer
