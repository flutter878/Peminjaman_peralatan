'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Card, CardContent, Typography, Button, Container } from '@mui/material'

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user')
    const role = localStorage.getItem('role')

    if (!userStr || role !== 'user') {
      router.push('/login')

      return
    }

    setUser(JSON.parse(userStr))
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    router.push('/login')
  }

  if (loading) {
    return <div className='p-6'>Memuat...</div>
  }

  return (
    <Container maxWidth='lg' className='py-8'>
      {/* Breadcrumb */}
      <div className='mb-6 flex items-center gap-2 text-sm'>
        <span className='text-gray-500'>Home</span>
        <span className='text-gray-400'>/</span>
        <span className='text-gray-700 font-medium'>Dashboard User</span>
      </div>

      {/* Welcome Header */}
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-gray-800'>Selamat Datang, {user?.nama}! 👋</h1>
        <p className='text-gray-600 mt-2'>Kelola peminjaman barang Anda dengan mudah</p>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <Card className='bg-blue-50 border border-blue-200'>
          <CardContent className='p-6'>
            <Typography color='textSecondary' gutterBottom>
              Total Peminjaman
            </Typography>
            <Typography variant='h4' className='text-blue-600 font-bold'>
              0
            </Typography>
            <Typography variant='caption' className='text-gray-600'>
              Semua waktu
            </Typography>
          </CardContent>
        </Card>

        <Card className='bg-yellow-50 border border-yellow-200'>
          <CardContent className='p-6'>
            <Typography color='textSecondary' gutterBottom>
              Sedang Dipinjam
            </Typography>
            <Typography variant='h4' className='text-yellow-600 font-bold'>
              0
            </Typography>
            <Typography variant='caption' className='text-gray-600'>
              Belum dikembalikan
            </Typography>
          </CardContent>
        </Card>

        <Card className='bg-green-50 border border-green-200'>
          <CardContent className='p-6'>
            <Typography color='textSecondary' gutterBottom>
              Dikembalikan
            </Typography>
            <Typography variant='h4' className='text-green-600 font-bold'>
              0
            </Typography>
            <Typography variant='caption' className='text-gray-600'>
              Sudah dikembalikan
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardContent className='p-8'>
          <div className='flex flex-col items-center justify-center py-12'>
            <Typography variant='h6' className='text-gray-600 mb-6'>
              Halaman Dashboard User sedang dalam pengembangan
            </Typography>
            <Button variant='contained' color='primary' onClick={handleLogout} className='mt-4'>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Info */}
      <Card className='mt-8 bg-gray-50'>
        <CardContent className='p-6'>
          <Typography variant='h6' className='mb-4 font-semibold'>
            Informasi Profil
          </Typography>
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <Typography className='text-gray-600'>Nama:</Typography>
              <Typography className='font-medium'>{user?.nama}</Typography>
            </div>
            <div className='flex justify-between'>
              <Typography className='text-gray-600'>Email:</Typography>
              <Typography className='font-medium'>{user?.email}</Typography>
            </div>
            <div className='flex justify-between'>
              <Typography className='text-gray-600'>Status:</Typography>
              <Typography className='font-medium text-green-600'>User Aktif</Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  )
}
