'use client'

import { useState } from 'react'

import { Button, Card } from '@mui/material'

import BarangForm from './form/BarangForm'
import BarangListTable from './list/BarangListTable'

interface Barang {
  kode_barang_232328: string
  nama_barang_232328: string
  kode_kategori_232328: string
  kode_lokasi_232328: string
  kondisi_232328: string
  status_232328: string
  jumlah_232328: number
  deskripsi_232328: string
  gambar_232328?: string
}

export default function BarangPage() {
  const [showForm, setShowForm] = useState(false)
  const [editData, setEditData] = useState<Barang | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditData(null)
    handleRefresh()
  }

  const handleEdit = (data: Barang) => {
    setEditData(data)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditData(null)
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className='mb-6 flex items-center gap-2 text-sm'>
        <span className='text-gray-500'>Home</span>
        <span className='text-gray-400'>/</span>
        <span className='text-gray-700 font-medium'>Data Barang</span>
      </div>

      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Data Barang</h1>
        <p className='text-gray-600'>Kelola data barang dan inventaris</p>
      </div>

      {/* Action Buttons */}
      <div className='mb-6 flex gap-2'>
        <Button
          variant={showForm ? 'contained' : 'outlined'}
          color='primary'
          onClick={() => {
            setShowForm(!showForm)

            if (showForm) {
              setEditData(null)
            }
          }}
        >
          {showForm ? (editData ? 'Lihat Daftar' : 'Lihat Daftar') : 'Tambah Barang'}
        </Button>
        <Button variant='outlined' color='primary' onClick={handleRefresh} disabled={showForm}>
          Refresh
        </Button>
      </div>

      {/* Content */}
      {showForm ? (
        <Card>
          <BarangForm onSuccess={handleFormSuccess} editData={editData || undefined} onCancel={handleCancel} />
        </Card>
      ) : (
        <BarangListTable refreshTrigger={refreshTrigger} onEdit={handleEdit} />
      )}
    </div>
  )
}
