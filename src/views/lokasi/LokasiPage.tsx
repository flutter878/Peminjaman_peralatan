'use client'

import { useState } from 'react'

import { Button, Card } from '@mui/material'

import LokasiForm from './form/LokasiForm'
import LokasiListTable from './list/LokasiListTable'

interface Lokasi {
  kode_lokasi_232328: string
  nama_lokasi_232328: string
}

export default function LokasiPage() {
  const [showForm, setShowForm] = useState(false)
  const [editData, setEditData] = useState<Lokasi | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditData(null)
    handleRefresh()
  }

  const handleEdit = (data: Lokasi) => {
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
        <span className='text-gray-700 font-medium'>Tempat Penyimpanan</span>
      </div>

      {/* Header */}
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Tempat Penyimpanan</h1>
        <p className='text-gray-600'>Kelola lokasi penyimpanan barang</p>
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
          {showForm ? 'Lihat Daftar' : 'Tambah Lokasi'}
        </Button>
        <Button variant='outlined' color='primary' onClick={handleRefresh} disabled={showForm}>
          Refresh
        </Button>
      </div>

      {/* Content */}
      {showForm ? (
        <Card>
          <LokasiForm onSuccess={handleFormSuccess} editData={editData} onCancel={handleCancel} />
        </Card>
      ) : (
        <LokasiListTable refreshTrigger={refreshTrigger} onEdit={handleEdit} />
      )}
    </div>
  )
}
