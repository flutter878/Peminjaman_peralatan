'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Autocomplete from '@mui/material/Autocomplete'

interface FormData {
  peminjam: string
  departemen: string
  tanggalPeminjaman: string
  tanggalKembali: string
  daftarBarang: string[]
  keterangan: string
}

const TambahPeminjaman = ({ onSuccess }: { onSuccess?: () => void }) => {
  // Available items
  const availableItems = [
    'Laptop',
    'Desktop',
    'Monitor',
    'Keyboard',
    'Mouse',
    'Printer',
    'Scanner',
    'Projector',
    'Screen',
    'Kursi',
    'Meja',
    'Lemari',
    'Kalkulator',
    'Camera',
    'Video Camera'
  ]

  // Departments
  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Admin']

  // Form States
  const [formData, setFormData] = useState<FormData>({
    peminjam: '',
    departemen: '',
    tanggalPeminjaman: '',
    tanggalKembali: '',
    daftarBarang: [],
    keterangan: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleItemsChange = (e: any, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      daftarBarang: value
    }))

    if (errors.daftarBarang) {
      setErrors(prev => ({
        ...prev,
        daftarBarang: ''
      }))
    }
  }

  const removeItem = (item: string) => {
    setFormData(prev => ({
      ...prev,
      daftarBarang: prev.daftarBarang.filter(i => i !== item)
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.peminjam.trim()) {
      newErrors.peminjam = 'Nama peminjam harus diisi'
    }

    if (!formData.departemen) {
      newErrors.departemen = 'Departemen harus dipilih'
    }

    if (!formData.tanggalPeminjaman) {
      newErrors.tanggalPeminjaman = 'Tanggal peminjaman harus diisi'
    }

    if (!formData.tanggalKembali) {
      newErrors.tanggalKembali = 'Tanggal kembali harus diisi'
    }

    if (
      formData.tanggalPeminjaman &&
      formData.tanggalKembali &&
      formData.tanggalPeminjaman >= formData.tanggalKembali
    ) {
      newErrors.tanggalKembali = 'Tanggal kembali harus lebih dari tanggal peminjaman'
    }

    if (formData.daftarBarang.length === 0) {
      newErrors.daftarBarang = 'Pilih minimal 1 barang'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      console.log('Form Data:', formData)
      setSuccessMessage('Permintaan peminjaman berhasil dibuat!')

      // Reset form
      setFormData({
        peminjam: '',
        departemen: '',
        tanggalPeminjaman: '',
        tanggalKembali: '',
        daftarBarang: [],
        keterangan: ''
      })

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
        if (onSuccess) onSuccess()
      }, 3000)
    } catch (error) {
      setErrors({ submit: 'Terjadi kesalahan saat menyimpan data' })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      peminjam: '',
      departemen: '',
      tanggalPeminjaman: '',
      tanggalKembali: '',
      daftarBarang: [],
      keterangan: ''
    })
    setErrors({})
    setSuccessMessage('')
  }

  return (
    <Card>
      <CardHeader title='Buat Permintaan Peminjaman Baru' />
      <CardContent>
        {successMessage && (
          <Alert severity='success' sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}
        {errors.submit && (
          <Alert severity='error' sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            {/* Peminjam */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Nama Peminjam'
                name='peminjam'
                value={formData.peminjam}
                onChange={handleInputChange}
                placeholder='Masukkan nama peminjam'
                error={!!errors.peminjam}
                helperText={errors.peminjam}
                disabled={loading}
              />
            </Grid>

            {/* Departemen */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.departemen} disabled={loading}>
                <InputLabel>Departemen</InputLabel>
                <Select name='departemen' value={formData.departemen} onChange={handleSelectChange} label='Departemen'>
                  <MenuItem value=''>
                    <em>Pilih Departemen</em>
                  </MenuItem>
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
                {errors.departemen && (
                  <Typography variant='caption' color='error' sx={{ mt: 0.5, display: 'block' }}>
                    {errors.departemen}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Tanggal Peminjaman */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='date'
                label='Tanggal Peminjaman'
                name='tanggalPeminjaman'
                value={formData.tanggalPeminjaman}
                onChange={handleInputChange}
                error={!!errors.tanggalPeminjaman}
                helperText={errors.tanggalPeminjaman}
                disabled={loading}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
              />
            </Grid>

            {/* Tanggal Kembali */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='date'
                label='Tanggal Kembali'
                name='tanggalKembali'
                value={formData.tanggalKembali}
                onChange={handleInputChange}
                error={!!errors.tanggalKembali}
                helperText={errors.tanggalKembali}
                disabled={loading}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
              />
            </Grid>

            {/* Daftar Barang */}
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={availableItems}
                value={formData.daftarBarang}
                onChange={handleItemsChange}
                disabled={loading}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Daftar Barang'
                    placeholder='Pilih barang yang ingin dipinjam'
                    error={!!errors.daftarBarang}
                    helperText={errors.daftarBarang}
                  />
                )}
              />
              {formData.daftarBarang.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                  {formData.daftarBarang.map(item => (
                    <Chip
                      key={item}
                      label={item}
                      onDelete={() => removeItem(item)}
                      color='primary'
                      variant='outlined'
                    />
                  ))}
                </Box>
              )}
            </Grid>

            {/* Keterangan */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label='Keterangan'
                name='keterangan'
                value={formData.keterangan}
                onChange={handleInputChange}
                placeholder='Masukkan keterangan atau alasan peminjaman'
                disabled={loading}
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button variant='outlined' onClick={handleReset} disabled={loading}>
                  Reset
                </Button>
                <Button variant='contained' type='submit' disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Buat Permintaan'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default TambahPeminjaman
