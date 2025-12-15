'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'

// Component Imports
import TambahListTable from './list/TambahListTable'
import TambahPeminjaman from './form/TambahPeminjaman'

const PermintaanPeminjamanPage = () => {
  const [showForm, setShowForm] = useState(false)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Breadcrumb */}
      <Box>
        <Breadcrumbs separator='/' sx={{ mb: 2 }}>
          <Link href='/' underline='hover' color='inherit'>
            Dashboard
          </Link>
          <Link href='/permintaan-peminjaman' underline='hover' color='inherit'>
            Peminjaman
          </Link>
          <Typography color='textPrimary'>Permintaan</Typography>
        </Breadcrumbs>
      </Box>

      {/* Header Section with Title and Refresh Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 600, mb: 0.5 }}>
            Permintaan Peminjaman
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Kelola semua permintaan peminjaman peralatan di sini
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant='contained'
            startIcon={<i className='ri-refresh-line' />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          <Button
            variant='contained'
            startIcon={<i className='ri-add-line' />}
            onClick={() => setShowForm(!showForm)}
            color={showForm ? 'error' : 'primary'}
          >
            {showForm ? 'Batal' : 'Tambah Permintaan'}
          </Button>
        </Box>
      </Box>

      {/* Form Section */}
      {showForm && (
        <Card sx={{ mb: 2 }}>
          <TambahPeminjaman onSuccess={() => setShowForm(false)} />
        </Card>
      )}

      {/* List Section */}
      <TambahListTable />

      {/* Quick Stats Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <Box sx={{ fontSize: '2rem', mb: 1, color: 'primary.main' }}>
              <i className='ri-time-line' />
            </Box>
            <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2</Box>
            <Box sx={{ color: 'text.secondary', mt: 1 }}>Permintaan Pending</Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <Box sx={{ fontSize: '2rem', mb: 1, color: 'success.main' }}>
              <i className='ri-check-double-line' />
            </Box>
            <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>8</Box>
            <Box sx={{ color: 'text.secondary', mt: 1 }}>Permintaan Disetujui</Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <Box sx={{ fontSize: '2rem', mb: 1, color: 'error.main' }}>
              <i className='ri-close-line' />
            </Box>
            <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>1</Box>
            <Box sx={{ color: 'text.secondary', mt: 1 }}>Permintaan Ditolak</Box>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 4 }}>
            <Box sx={{ fontSize: '2rem', mb: 1, color: 'info.main' }}>
              <i className='ri-check-line' />
            </Box>
            <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>3</Box>
            <Box sx={{ color: 'text.secondary', mt: 1 }}>Barang Dikembalikan</Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PermintaanPeminjamanPage
