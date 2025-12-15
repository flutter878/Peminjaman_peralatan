'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { Alert } from '@mui/material'

interface BarangFormProps {
  onSuccess?: () => void
  editData?: {
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
  onCancel?: () => void
}

interface Kategori {
  kode_kategori_232328: string
  nama_kategori_232328: string
}

interface Lokasi {
  kode_lokasi_232328: string
  nama_lokasi_232328: string
}

export default function BarangForm({ onSuccess, editData = null, onCancel }: BarangFormProps) {
  const isEditMode = !!editData

  const [loading, setLoading] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [kodeDuplicate, setKodeDuplicate] = useState(false)
  const [kategoris, setKategoris] = useState<Kategori[]>([])
  const [lokasis, setLokasis] = useState<Lokasi[]>([])

  const [formData, setFormData] = useState({
    kode_barang: editData?.kode_barang_232328 || '',
    nama_barang: editData?.nama_barang_232328 || '',
    kode_kategori: editData?.kode_kategori_232328 || '',
    kode_lokasi: editData?.kode_lokasi_232328 || '',
    kondisi: editData?.kondisi_232328 || 'baik',
    status: editData?.status_232328 || 'tersedia',
    jumlah: editData?.jumlah_232328?.toString() || '',
    deskripsi: editData?.deskripsi_232328 || '',
    gambar: ''
  })

  const [previewGambar, setPreviewGambar] = useState<string | null>(
    editData?.gambar_232328 ? `data:image/jpeg;base64,${editData.gambar_232328}` : null
  )

  // Fetch kategori and lokasi options
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true)

      try {
        const [kategoriRes, lokasiRes] = await Promise.all([fetch('/api/kategori'), fetch('/api/lokasi')])

        const kategoriData = await kategoriRes.json()
        const lokasiData = await lokasiRes.json()

        if (kategoriData.success && Array.isArray(kategoriData.data)) {
          setKategoris(kategoriData.data)
        }

        if (lokasiData.success && Array.isArray(lokasiData.data)) {
          setLokasis(lokasiData.data)
        }
      } catch (error) {
        console.error('Error fetching options:', error)
      } finally {
        setLoadingOptions(false)
      }
    }

    fetchOptions()
  }, [])

  // Check kode_barang uniqueness
  const checkKodeBarangUniqueness = async (kode: string) => {
    if (!kode) {
      setKodeDuplicate(false)

      return true
    }

    try {
      const response = await fetch(`/api/barang?kode=${kode}`)
      const result = await response.json()

      if (result.exists) {
        setKodeDuplicate(true)

        return false
      } else {
        setKodeDuplicate(false)

        return true
      }
    } catch (error) {
      console.error('Error checking kode barang:', error)

      return true
    }
  }

  const handleKodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()

    setFormData(prev => ({
      ...prev,
      kode_barang: value
    }))

    checkKodeBarangUniqueness(value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle file upload for gambar
  const handleGambarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = event => {
        const base64String = event.target?.result as string

        setFormData(prev => ({
          ...prev,
          gambar: base64String.split(',')[1] || base64String // Get only the base64 part
        }))

        setPreviewGambar(base64String)
      }

      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate required fields
    if (
      !formData.kode_barang ||
      !formData.nama_barang ||
      !formData.kode_kategori ||
      !formData.kode_lokasi ||
      !formData.jumlah
    ) {
      setError('Semua field yang diperlukan harus diisi')

      return
    }

    // Check kode_barang length
    if (formData.kode_barang.length > 10) {
      setError('Kode barang maksimal 10 karakter')

      return
    }

    // Check if kode is duplicate
    if (!isEditMode && kodeDuplicate) {
      setError('Kode barang sudah digunakan')

      return
    }

    setLoading(true)

    try {
      const method = isEditMode ? 'PUT' : 'POST'

      const requestBody = isEditMode
        ? {
            kode_barang: formData.kode_barang,
            nama_barang: formData.nama_barang,
            kode_kategori: formData.kode_kategori,
            kode_lokasi: formData.kode_lokasi,
            kondisi: formData.kondisi,
            status: formData.status,
            jumlah: parseInt(formData.jumlah),
            deskripsi: formData.deskripsi || null,
            gambar: formData.gambar || null,
            kode_barang_lama: editData?.kode_barang_232328
          }
        : {
            kode_barang: formData.kode_barang,
            nama_barang: formData.nama_barang,
            kode_kategori: formData.kode_kategori,
            kode_lokasi: formData.kode_lokasi,
            kondisi: formData.kondisi,
            status: formData.status,
            jumlah: parseInt(formData.jumlah),
            deskripsi: formData.deskripsi || null,
            gambar: formData.gambar || null
          }

      const response = await fetch('/api/barang', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(isEditMode ? 'Barang berhasil diperbarui' : 'Barang berhasil ditambahkan')
        setFormData({
          kode_barang: '',
          nama_barang: '',
          kode_kategori: '',
          kode_lokasi: '',
          kondisi: 'baik',
          status: 'tersedia',
          jumlah: '',
          deskripsi: '',
          gambar: ''
        })
        setPreviewGambar(null)

        // Call onCancel first if in edit mode (will clear editData in parent)
        if (isEditMode) {
          onCancel?.()
        }

        // Call onSuccess callback
        setTimeout(() => {
          onSuccess?.()
        }, 1500)
      } else {
        setError(result.message || (isEditMode ? 'Gagal memperbarui barang' : 'Gagal menambah barang'))
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menambah barang')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-6'>
      <h3 className='mb-6 text-xl font-semibold'>Tambah Barang Baru</h3>

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
          {/* Kode Barang */}
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Kode Barang <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              name='kode_barang'
              value={formData.kode_barang}
              onChange={handleKodeChange}
              placeholder='Contoh: BARANG001'
              maxLength={10}
              className={`w-full rounded border px-3 py-2 ${
                kodeDuplicate ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={loading || loadingOptions}
            />
            {kodeDuplicate && <p className='mt-1 text-xs text-red-500'>Kode barang sudah digunakan</p>}
            <p className='mt-1 text-xs text-gray-500'>{formData.kode_barang.length}/10 karakter</p>
          </div>

          {/* Nama Barang */}
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Nama Barang <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              name='nama_barang'
              value={formData.nama_barang}
              onChange={handleChange}
              placeholder='Masukkan nama barang'
              className='w-full rounded border border-gray-300 px-3 py-2'
              disabled={loading || loadingOptions}
            />
          </div>

          {/* Kategori */}
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Kategori <span className='text-red-500'>*</span>
            </label>
            <select
              name='kode_kategori'
              value={formData.kode_kategori}
              onChange={handleChange}
              className='w-full rounded border border-gray-300 px-3 py-2'
              disabled={loading || loadingOptions || kategoris.length === 0}
            >
              <option value=''>-- Pilih Kategori --</option>
              {kategoris.map(kategori => (
                <option key={kategori.kode_kategori_232328} value={kategori.kode_kategori_232328}>
                  {kategori.nama_kategori_232328} ({kategori.kode_kategori_232328})
                </option>
              ))}
            </select>
            {loadingOptions && <p className='mt-1 text-xs text-gray-500'>Memuat kategori...</p>}
            {!loadingOptions && kategoris.length === 0 && (
              <p className='mt-1 text-xs text-amber-500'>Belum ada kategori, silakan tambah terlebih dahulu</p>
            )}
          </div>

          {/* Lokasi */}
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Lokasi Penyimpanan <span className='text-red-500'>*</span>
            </label>
            <select
              name='kode_lokasi'
              value={formData.kode_lokasi}
              onChange={handleChange}
              className='w-full rounded border border-gray-300 px-3 py-2'
              disabled={loading || loadingOptions || lokasis.length === 0}
            >
              <option value=''>-- Pilih Lokasi --</option>
              {lokasis.map(lokasi => (
                <option key={lokasi.kode_lokasi_232328} value={lokasi.kode_lokasi_232328}>
                  {lokasi.nama_lokasi_232328} ({lokasi.kode_lokasi_232328})
                </option>
              ))}
            </select>
            {loadingOptions && <p className='mt-1 text-xs text-gray-500'>Memuat lokasi...</p>}
            {!loadingOptions && lokasis.length === 0 && (
              <p className='mt-1 text-xs text-amber-500'>Belum ada lokasi, silakan tambah terlebih dahulu</p>
            )}
          </div>

          {/* Kondisi */}
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Kondisi <span className='text-red-500'>*</span>
            </label>
            <select
              name='kondisi'
              value={formData.kondisi}
              onChange={handleChange}
              className='w-full rounded border border-gray-300 px-3 py-2'
              disabled={loading || loadingOptions}
            >
              <option value='baik'>Baik</option>
              <option value='rusak ringan'>Rusak Ringan</option>
              <option value='rusak berat'>Rusak Berat</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Status <span className='text-red-500'>*</span>
            </label>
            <select
              name='status'
              value={formData.status}
              onChange={handleChange}
              className='w-full rounded border border-gray-300 px-3 py-2'
              disabled={loading || loadingOptions}
            >
              <option value='tersedia'>Tersedia</option>
              <option value='dipinjam'>Dipinjam</option>
            </select>
          </div>

          {/* Jumlah */}
          <div>
            <label className='mb-2 block text-sm font-medium'>
              Jumlah <span className='text-red-500'>*</span>
            </label>
            <input
              type='number'
              name='jumlah'
              value={formData.jumlah}
              onChange={handleChange}
              placeholder='0'
              min='0'
              className='w-full rounded border border-gray-300 px-3 py-2'
              disabled={loading || loadingOptions}
            />
          </div>

          {/* Deskripsi */}
          <div className='md:col-span-2'>
            <label className='mb-2 block text-sm font-medium'>Deskripsi</label>
            <textarea
              name='deskripsi'
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder='Masukkan deskripsi barang (opsional)'
              rows={3}
              className='w-full rounded border border-gray-300 px-3 py-2'
              disabled={loading || loadingOptions}
            />
          </div>

          {/* Gambar */}
          <div className='md:col-span-2'>
            <label className='mb-2 block text-sm font-medium'>Gambar Barang</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleGambarChange}
              className='w-full rounded border border-gray-300 px-3 py-2'
              disabled={loading || loadingOptions}
            />
            <p className='mt-1 text-xs text-gray-500'>Format: JPG, PNG, GIF (Maks 5MB)</p>
            {previewGambar && (
              <div className='mt-4'>
                <p className='mb-2 text-sm font-medium'>Preview:</p>
                <img src={previewGambar} alt='Preview' className='h-32 w-32 rounded border object-cover' />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex gap-2 pt-4'>
          <button
            type='submit'
            disabled={loading || kodeDuplicate || loadingOptions}
            className={`rounded px-6 py-2 font-medium text-white ${
              loading || kodeDuplicate || loadingOptions
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Menambah...' : 'Tambah Barang'}
          </button>
        </div>
      </form>
    </div>
  )
}
