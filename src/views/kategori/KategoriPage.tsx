'use client'

import { useState } from 'react'

import { Button, Card } from '@mui/material'

import KategoriForm from './form/KategoriForm'
import KategoriListTable from './list/KategoriListTable'

interface Kategori {
  kode_kategori_232328: string
  nama_kategori_232328: string
}

export default function KategoriPage() {
  const [showForm, setShowForm] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editData, setEditData] = useState<Kategori | null>(null)

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditData(null)
    handleRefresh()
  }

  const handleEdit = (data: Kategori) => {
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
        <span className='text-gray-700 font-medium'>Data Kategori</span>
      </div>

      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Data Kategori</h1>
        <p className='text-gray-600'>Kelola kategori barang</p>
      </div>

      {/* Action Buttons */}
      <div className='mb-6 flex gap-2'>
        <Button
          variant={showForm ? 'contained' : 'outlined'}
          color='primary'
          onClick={() => {
            if (showForm) {
              setShowForm(false)
              setEditData(null)
            } else {
              setShowForm(true)
            }
          }}
        >
          {showForm ? 'Lihat Daftar' : 'Tambah Kategori'}
        </Button>
        <Button variant='outlined' color='primary' onClick={handleRefresh} disabled={showForm}>
          Refresh
        </Button>
      </div>

      {/* Content */}
      {showForm ? (
        <Card>
          <KategoriForm onSuccess={handleFormSuccess} editData={editData} onCancel={handleCancel} />
        </Card>
      ) : (
        <KategoriListTable refreshTrigger={refreshTrigger} onEdit={handleEdit} />
      )}
    </div>
  )
}
