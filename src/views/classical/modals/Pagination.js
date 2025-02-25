import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'

const Pagination = ({ currentPage, totalPageCount, onPageChange }) => {
  const currentGroupStart = Math.floor((currentPage - 1) / 10) * 10 + 1
  const currentGroupEnd = Math.min(currentGroupStart + 9, totalPageCount)

  return (
    <CPagination align="center" className="mt-3">
      {/* ⬅️ 처음 페이지 */}
      <CPaginationItem
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        className="custom-pointer"
      >
        « First
      </CPaginationItem>

      {/* ⬅️ 이전 페이지 */}
      <CPaginationItem
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="custom-pointer"
      >
        ‹ Prev
      </CPaginationItem>

      {/* 📌 현재 페이지 그룹 계산 */}
      {Array.from({ length: currentGroupEnd - currentGroupStart + 1 }, (_, i) => (
        <CPaginationItem
          key={currentGroupStart + i}
          active={currentGroupStart + i === currentPage}
          onClick={() => onPageChange(currentGroupStart + i)}
          className="custom-pointer"
        >
          {currentGroupStart + i}
        </CPaginationItem>
      ))}

      {/* ➡️ 다음 페이지 */}
      <CPaginationItem
        disabled={currentPage === totalPageCount}
        onClick={() => onPageChange(currentPage + 1)}
        className="custom-pointer"
      >
        Next ›
      </CPaginationItem>

      {/* ➡️ 마지막 페이지 */}
      <CPaginationItem
        disabled={currentPage === totalPageCount}
        onClick={() => onPageChange(totalPageCount)}
        className="custom-pointer"
      >
        Last »
      </CPaginationItem>
    </CPagination>
  )
}

export default Pagination
