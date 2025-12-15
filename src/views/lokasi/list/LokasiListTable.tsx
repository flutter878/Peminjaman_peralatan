'use client'

import { useEffect, useState } from 'react'

import tableStyles from '@core/styles/table.module.css'

interface Lokasi {
  kode_lokasi_232328: string
  nama_lokasi_232328: string
}

interface LokasiListTableProps {
  refreshTrigger?: number
  onEdit?: (data: Lokasi) => void
}

export default function LokasiListTable({ refreshTrigger = 0, onEdit }: LokasiListTableProps) {
  const [lokasis, setLokasis] = useState<Lokasi[]>([])
  const [filteredLokasis, setFilteredLokasis] = useState<Lokasi[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchLokasis = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/lokasi')
      const result = await response.json()

      if (result.success && Array.isArray(result.data)) {
        setLokasis(result.data)
        setFilteredLokasis(result.data)
        setCurrentPage(1)
      }
    } catch (error) {
      console.error('Error fetching lokasis:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLokasis()
  }, [refreshTrigger])

  // Search filter
  useEffect(() => {
    const filtered = lokasis.filter(
      lokasi =>
        lokasi.kode_lokasi_232328.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lokasi.nama_lokasi_232328.toLowerCase().includes(searchTerm.toLowerCase())
    )

    setFilteredLokasis(filtered)
    setCurrentPage(1)
  }, [searchTerm, lokasis])

  // Pagination
  const totalPages = Math.ceil(filteredLokasis.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLokasis = filteredLokasis.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleDelete = async (kode: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus lokasi ini?')) {
      return
    }

    setDeleteLoading(true)

    try {
      const response = await fetch('/api/lokasi', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ kode_lokasi: kode })
      })

      const result = await response.json()

      if (result.success) {
        fetchLokasis()
      } else {
        alert(result.message || 'Gagal menghapus lokasi')
      }
    } catch (error) {
      console.error('Error deleting lokasi:', error)
      alert('Terjadi kesalahan saat menghapus lokasi')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return <div className='p-6'>Memuat data...</div>
  }

  return (
    <div className={tableStyles.container}>
      {/* Show Entries and Search */}
      <div className={tableStyles.controls}>
        <div className={tableStyles.entriesControl}>
          <label htmlFor='entries'>Tampilkan </label>
          <select
            id='entries'
            value={itemsPerPage}
            onChange={e => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <label htmlFor='entries'> entries</label>
        </div>

        <div className={tableStyles.searchControl}>
          <label htmlFor='search'>Cari: </label>
          <input
            id='search'
            type='text'
            placeholder='Kode atau Nama Lokasi'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <table className={tableStyles.table}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Kode Lokasi</th>
            <th>Nama Lokasi</th>
            <th style={{ width: '150px', textAlign: 'center' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLokasis.length > 0 ? (
            paginatedLokasis.map((lokasi, index) => (
              <tr key={lokasi.kode_lokasi_232328}>
                <td className={tableStyles.rowNumber}>{startIndex + index + 1}</td>
                <td className={tableStyles.kode}>{lokasi.kode_lokasi_232328}</td>
                <td>{lokasi.nama_lokasi_232328}</td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => onEdit?.(lokasi)}
                    className='mr-2 inline-block rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lokasi.kode_lokasi_232328)}
                    disabled={deleteLoading}
                    className='inline-block rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:bg-red-300'
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className={tableStyles.emptyState}>
                Tidak ada data lokasi
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className={tableStyles.pagination}>
        <div>
          Menampilkan {filteredLokasis.length > 0 ? startIndex + 1 : 0} sampai{' '}
          {Math.min(endIndex, filteredLokasis.length)} dari {filteredLokasis.length} entries
        </div>
        <div className={tableStyles.paginationButtons}>
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className={tableStyles.btnPagination}>
            Sebelumnya
          </button>
          <span className={tableStyles.pageInfo}>
            Halaman {totalPages > 0 ? currentPage : 0} dari {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={tableStyles.btnPagination}
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  )
}
