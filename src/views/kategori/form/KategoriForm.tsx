'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'

import { Alert } from '@mui/material'

interface KategoriFormProps {
  onSuccess?: () => void
  editData?: {
    kode_kategori_232328: string
    nama_kategori_232328: string
  } | null
  onCancel?: () => void
}

export default function KategoriForm({ onSuccess, editData, onCancel }: KategoriFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [kodeDuplicate, setKodeDuplicate] = useState(false)
  const [namaDuplicate, setNamaDuplicate] = useState(false)

  const [formData, setFormData] = useState({
    kode_kategori: editData?.kode_kategori_232328 || '',
    nama_kategori: editData?.nama_kategori_232328 || ''
  })

  const isEditMode = !!editData

  // Check kode_kategori uniqueness
  const checkKodeUniqueness = async (kode: string) => {
    if (!kode) {
      setKodeDuplicate(false)

      return true
    }

    // If in edit mode and kode hasn't changed, don't check
    if (isEditMode && kode === editData?.kode_kategori_232328) {
      setKodeDuplicate(false)

      return true
    }

    try {
      const response = await fetch(`/api/kategori?kode=${kode}`)
      const result = await response.json()

      if (result.exists) {
        setKodeDuplicate(true)

        return false
      } else {
        setKodeDuplicate(false)

        return true
      }
    } catch (error) {
      console.error('Error checking kode kategori:', error)

      return true
    }
  }

  // Check nama_kategori uniqueness
  const checkNamaUniqueness = async (nama: string) => {
    if (!nama) {
      setNamaDuplicate(false)

      return true
    }

    // If in edit mode and nama hasn't changed, don't check
    if (isEditMode && nama === editData?.nama_kategori_232328) {
      setNamaDuplicate(false)

      return true
    }

    try {
      const response = await fetch(`/api/kategori?nama=${encodeURIComponent(nama)}`)
      const result = await response.json()

      if (result.exists) {
        setNamaDuplicate(true)

        return false
      } else {
        setNamaDuplicate(false)

        return true
      }
    } catch (error) {
      console.error('Error checking nama kategori:', error)

      return true
    }
  }

  const handleKodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()

    setFormData(prev => ({
      ...prev,
      kode_kategori: value
    }))

    checkKodeUniqueness(value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === 'nama_kategori') {
      checkNamaUniqueness(value)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate required fields
    if (!formData.kode_kategori || !formData.nama_kategori) {
      setError('Kode dan nama kategori harus diisi')

      return
    }

    // Check kode_kategori length
    if (formData.kode_kategori.length > 5) {
      setError('Kode kategori maksimal 5 karakter')

      return
    }

    // Check if kode is duplicate
    if (kodeDuplicate) {
      setError('Kode kategori sudah digunakan')

      return
    }

    // Check if nama is duplicate
    if (namaDuplicate) {
      setError('Nama kategori sudah digunakan')

      return
    }

    setLoading(true)

    try {
      const method = isEditMode ? 'PUT' : 'POST'

      const body = isEditMode
        ? {
            kode_kategori: formData.kode_kategori,
            nama_kategori: formData.nama_kategori,
            kode_kategori_lama: editData?.kode_kategori_232328
          }
        : {
            kode_kategori: formData.kode_kategori,
            nama_kategori: formData.nama_kategori
          }

      const response = await fetch('/api/kategori', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(isEditMode ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan')
        setFormData({
          kode_kategori: '',
          nama_kategori: ''
        })

        // Call onSuccess callback
        setTimeout(() => {
          onSuccess?.()
        }, 1500)
      } else {
        setError(result.message || (isEditMode ? 'Gagal memperbarui kategori' : 'Gagal menambah kategori'))
      }
    } catch (err) {
      setError(isEditMode ? 'Terjadi kesalahan saat memperbarui kategori' : 'Terjadi kesalahan saat menambah kategori')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-6'>
      <h3 className='mb-6 text-xl font-semibold'>{isEditMode ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3>

      {error && (
        <Alert severity='error' className='mb-4'>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity='success' className='mb-4'>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {/* Kode Kategori */}
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Kode Kategori <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              name='kode_kategori'
              value={formData.kode_kategori}
              onChange={handleKodeChange}
              placeholder='Contoh: KAT01'
              maxLength={5}
              className={`w-full rounded border px-3 py-2 ${
                kodeDuplicate ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {kodeDuplicate && <p className='mt-1 text-xs text-red-500'>Kode kategori sudah digunakan</p>}
            <p className='mt-1 text-xs text-gray-500'>{formData.kode_kategori.length}/5 karakter</p>
          </div>

          {/* Nama Kategori */}
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Nama Kategori <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              name='nama_kategori'
              value={formData.nama_kategori}
              onChange={handleChange}
              placeholder='Masukkan nama kategori'
              className={`w-full rounded border px-3 py-2 ${
                namaDuplicate ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {namaDuplicate && <p className='mt-1 text-xs text-red-500'>Nama kategori sudah digunakan</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex gap-2 pt-4'>
          <button
            type='submit'
            disabled={loading || kodeDuplicate || namaDuplicate}
            className={`rounded px-6 py-2 font-medium text-white ${
              loading || kodeDuplicate || namaDuplicate
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (isEditMode ? 'Memperbarui...' : 'Menambah...') : isEditMode ? 'Perbarui' : 'Tambah'}
          </button>
          {isEditMode && (
            <button
              type='button'
              onClick={onCancel}
              disabled={loading}
              className='rounded border border-gray-300 px-6 py-2 font-medium text-gray-700 hover:bg-gray-50'
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
