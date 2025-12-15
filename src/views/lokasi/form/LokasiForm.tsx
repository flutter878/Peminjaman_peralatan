'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'

import { Alert } from '@mui/material'

interface Lokasi {
  kode_lokasi_232328: string
  nama_lokasi_232328: string
}

interface LokasiFormProps {
  onSuccess?: () => void
  editData?: Lokasi | null
  onCancel?: () => void
}

export default function LokasiForm({ onSuccess, editData = null, onCancel }: LokasiFormProps) {
  const isEditMode = !!editData

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [kodeDuplicate, setKodeDuplicate] = useState(false)
  const [namaDuplicate, setNamaDuplicate] = useState(false)

  const [formData, setFormData] = useState({
    kode_lokasi: editData?.kode_lokasi_232328 || '',
    nama_lokasi: editData?.nama_lokasi_232328 || ''
  })

  // Check kode_lokasi uniqueness
  const checkKodeUniqueness = async (kode: string) => {
    if (!kode) {
      setKodeDuplicate(false)

      return true
    }

    // Skip validation if in edit mode and value hasn't changed
    if (isEditMode && kode === editData?.kode_lokasi_232328) {
      setKodeDuplicate(false)

      return true
    }

    try {
      const response = await fetch(`/api/lokasi?kode=${kode}`)
      const result = await response.json()

      if (result.exists) {
        setKodeDuplicate(true)

        return false
      } else {
        setKodeDuplicate(false)

        return true
      }
    } catch (error) {
      console.error('Error checking kode lokasi:', error)

      return true
    }
  }

  // Check nama_lokasi uniqueness
  const checkNamaUniqueness = async (nama: string) => {
    if (!nama) {
      setNamaDuplicate(false)

      return true
    }

    // Skip validation if in edit mode and value hasn't changed
    if (isEditMode && nama === editData?.nama_lokasi_232328) {
      setNamaDuplicate(false)

      return true
    }

    try {
      const response = await fetch(`/api/lokasi?nama=${encodeURIComponent(nama)}`)
      const result = await response.json()

      if (result.exists) {
        setNamaDuplicate(true)

        return false
      } else {
        setNamaDuplicate(false)

        return true
      }
    } catch (error) {
      console.error('Error checking nama lokasi:', error)

      return true
    }
  }

  const handleKodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()

    setFormData(prev => ({
      ...prev,
      kode_lokasi: value
    }))

    checkKodeUniqueness(value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (name === 'nama_lokasi') {
      checkNamaUniqueness(value)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate required fields
    if (!formData.kode_lokasi || !formData.nama_lokasi) {
      setError('Kode dan nama lokasi harus diisi')

      return
    }

    // Check kode_lokasi length
    if (formData.kode_lokasi.length > 5) {
      setError('Kode lokasi maksimal 5 karakter')

      return
    }

    // Check if kode is duplicate
    if (kodeDuplicate) {
      setError('Kode lokasi sudah digunakan')

      return
    }

    // Check if nama is duplicate
    if (namaDuplicate) {
      setError('Nama lokasi sudah digunakan')

      return
    }

    setLoading(true)

    try {
      const method = isEditMode ? 'PUT' : 'POST'

      const body = isEditMode
        ? {
            kode_lokasi: formData.kode_lokasi,
            nama_lokasi: formData.nama_lokasi,
            kode_lokasi_lama: editData?.kode_lokasi_232328
          }
        : {
            kode_lokasi: formData.kode_lokasi,
            nama_lokasi: formData.nama_lokasi
          }

      const response = await fetch('/api/lokasi', {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(isEditMode ? 'Lokasi berhasil diperbarui' : 'Lokasi berhasil ditambahkan')
        setFormData({
          kode_lokasi: '',
          nama_lokasi: ''
        })

        // Call onSuccess callback
        setTimeout(() => {
          onSuccess?.()
        }, 1500)
      } else {
        setError(result.message || (isEditMode ? 'Gagal memperbarui lokasi' : 'Gagal menambah lokasi'))
      }
    } catch (err) {
      setError(isEditMode ? 'Terjadi kesalahan saat memperbarui lokasi' : 'Terjadi kesalahan saat menambah lokasi')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-6'>
      <h3 className='mb-6 text-xl font-semibold'>{isEditMode ? 'Edit Lokasi' : 'Tambah Lokasi Baru'}</h3>

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
          {/* Kode Lokasi */}
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Kode Lokasi <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              name='kode_lokasi'
              value={formData.kode_lokasi}
              onChange={handleKodeChange}
              placeholder='Contoh: LOK01'
              maxLength={5}
              className={`w-full rounded border px-3 py-2 ${
                kodeDuplicate ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {kodeDuplicate && <p className='mt-1 text-xs text-red-500'>Kode lokasi sudah digunakan</p>}
            <p className='mt-1 text-xs text-gray-500'>{formData.kode_lokasi.length}/5 karakter</p>
          </div>

          {/* Nama Lokasi */}
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Nama Lokasi <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              name='nama_lokasi'
              value={formData.nama_lokasi}
              onChange={handleChange}
              placeholder='Masukkan nama lokasi'
              className={`w-full rounded border px-3 py-2 ${
                namaDuplicate ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {namaDuplicate && <p className='mt-1 text-xs text-red-500'>Nama lokasi sudah digunakan</p>}
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
            {loading
              ? isEditMode
                ? 'Memperbarui...'
                : 'Menambah...'
              : isEditMode
                ? 'Perbarui Lokasi'
                : 'Tambah Lokasi'}
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
