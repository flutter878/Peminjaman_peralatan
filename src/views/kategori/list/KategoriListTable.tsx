'use client'

import { useEffect, useState } from 'react'

import tableStyles from '@core/styles/table.module.css'

interface Kategori {
  kode_kategori_232328: string
  nama_kategori_232328: string
}

interface KategoriListTableProps {
  refreshTrigger?: number
  onEdit?: (data: Kategori) => void
}

export default function KategoriListTable({ refreshTrigger = 0, onEdit }: KategoriListTableProps) {
  const [kategoris, setKategoris] = useState<Kategori[]>([])
  const [filteredKategoris, setFilteredKategoris] = useState<Kategori[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchKategoris = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/kategori')
      const result = await response.json()

      if (result.success && Array.isArray(result.data)) {
        setKategoris(result.data)
        setFilteredKategoris(result.data)
        setCurrentPage(1)
      }
    } catch (error) {
      console.error('Error fetching kategoris:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKategoris()
  }, [refreshTrigger])

  useEffect(() => {
    const filtered = kategoris.filter(
      kategori =>
        kategori.kode_kategori_232328.toLowerCase().includes(searchTerm.toLowerCase()) ||
        kategori.nama_kategori_232328.toLowerCase().includes(searchTerm.toLowerCase())
    )

    setFilteredKategoris(filtered)
    setCurrentPage(1)
  }, [searchTerm, kategoris])

  const totalPages = Math.ceil(filteredKategoris.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedKategoris = filteredKategoris.slice(startIndex, endIndex)

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
    if (!window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      return
    }

    setDeleteLoading(true)

    try {
      const response = await fetch('/api/kategori', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ kode_kategori: kode })
      })

      const result = await response.json()

      if (result.success) {
        fetchKategoris()
      } else {
        alert(result.message || 'Gagal menghapus kategori')
      }
    } catch (error) {
      console.error('Error deleting kategori:', error)
      alert('Terjadi kesalahan saat menghapus kategori')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return <div className='p-6'>Memuat data...</div>
  }

  return (
    <div className={tableStyles.container}>
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
            placeholder='Kode atau Nama Kategori'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className={tableStyles.table}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Kode Kategori</th>
            <th>Nama Kategori</th>
            <th style={{ width: '150px', textAlign: 'center' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedKategoris.length > 0 ? (
            paginatedKategoris.map((kategori, index) => (
              <tr key={kategori.kode_kategori_232328}>
                <td className={tableStyles.rowNumber}>{startIndex + index + 1}</td>
                <td className={tableStyles.kode}>{kategori.kode_kategori_232328}</td>
                <td>{kategori.nama_kategori_232328}</td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    onClick={() => onEdit?.(kategori)}
                    className='mr-2 inline-block rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(kategori.kode_kategori_232328)}
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
                Tidak ada data kategori
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={tableStyles.pagination}>
        <div>
          Menampilkan {filteredKategoris.length > 0 ? startIndex + 1 : 0} sampai{' '}
          {Math.min(endIndex, filteredKategoris.length)} dari {filteredKategoris.length} entries
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
