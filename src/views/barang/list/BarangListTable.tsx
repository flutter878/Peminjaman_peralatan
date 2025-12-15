'use client'

import { useEffect, useState } from 'react'

import tableStyles from '@core/styles/table.module.css'

interface Barang {
  kode_barang_232328: string
  nama_barang_232328: string
  kode_kategori_232328: string
  kode_lokasi_232328: string
  kondisi_232328: string
  status_232328: string
  jumlah_232328: number
  deskripsi_232328: string
}

interface BarangListTableProps {
  refreshTrigger?: number
}

export default function BarangListTable({ refreshTrigger = 0 }: BarangListTableProps) {
  const [barangs, setBarangs] = useState<Barang[]>([])
  const [filteredBarangs, setFilteredBarangs] = useState<Barang[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchBarangs = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/barang')
      const result = await response.json()

      if (result.success && Array.isArray(result.data)) {
        setBarangs(result.data)
        setFilteredBarangs(result.data)
        setCurrentPage(1)
      }
    } catch (error) {
      console.error('Error fetching barangs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBarangs()
  }, [refreshTrigger])

  // Search filter
  useEffect(() => {
    const filtered = barangs.filter(
      barang =>
        barang.kode_barang_232328.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barang.nama_barang_232328.toLowerCase().includes(searchTerm.toLowerCase())
    )

    setFilteredBarangs(filtered)
    setCurrentPage(1)
  }, [searchTerm, barangs])

  // Pagination
  const totalPages = Math.ceil(filteredBarangs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBarangs = filteredBarangs.slice(startIndex, endIndex)

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tersedia':
        return '#28a745'
      case 'dipinjam':
        return '#ffc107'
      default:
        return '#6c757d'
    }
  }

  const getKondisiColor = (kondisi: string) => {
    switch (kondisi) {
      case 'baik':
        return '#28a745'
      case 'rusak ringan':
        return '#ffc107'
      case 'rusak berat':
        return '#dc3545'
      default:
        return '#6c757d'
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
            placeholder='Kode atau Nama Barang'
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
            <th>Kode Barang</th>
            <th>Nama Barang</th>
            <th>Kategori</th>
            <th>Lokasi</th>
            <th>Kondisi</th>
            <th>Status</th>
            <th>Jumlah</th>
            <th>Deskripsi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBarangs.length > 0 ? (
            paginatedBarangs.map((barang, index) => (
              <tr key={barang.kode_barang_232328}>
                <td className={tableStyles.rowNumber}>{startIndex + index + 1}</td>
                <td className={tableStyles.kode}>{barang.kode_barang_232328}</td>
                <td>{barang.nama_barang_232328}</td>
                <td>{barang.kode_kategori_232328}</td>
                <td>{barang.kode_lokasi_232328}</td>
                <td>
                  <span
                    style={{
                      backgroundColor: getKondisiColor(barang.kondisi_232328),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    {barang.kondisi_232328}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      backgroundColor: getStatusColor(barang.status_232328),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    {barang.status_232328}
                  </span>
                </td>
                <td className={tableStyles.quantity}>{barang.jumlah_232328}</td>
                <td>{barang.deskripsi_232328 || '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className={tableStyles.emptyState}>
                Tidak ada data barang
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className={tableStyles.pagination}>
        <div>
          Menampilkan {filteredBarangs.length > 0 ? startIndex + 1 : 0} sampai{' '}
          {Math.min(endIndex, filteredBarangs.length)} dari {filteredBarangs.length} entries
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
