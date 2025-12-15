'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

// Styles Imports
import tableStyles from '@core/styles/table.module.css'

interface PermintaanPeminjaman {
  id: number
  nomorPermintaan: string
  namaBarang: string
  peminjam: string
  tanggalPermintaan: string
  tanggalPeminjaman: string
  tanggalKembali?: string
  status: 'Terima' | 'Tolak' | 'Dikembalikan'
  jumlahBarang: number
  keterangan: string
}

const TambahListTable = () => {
  // Sample data matching screenshot
  const initialData: PermintaanPeminjaman[] = [
    {
      id: 1,
      nomorPermintaan: '1',
      namaBarang: 'Mouse Logitech M900',
      peminjam: 'tess',
      tanggalPermintaan: '24 Juni 2025 - 12:49',
      tanggalPeminjaman: '25 Juni 2025 - 17:45',
      status: 'Terima',
      jumlahBarang: 4,
      keterangan: 'karyawan'
    },
    {
      id: 2,
      nomorPermintaan: '2',
      namaBarang: 'Mouse Logitech M900',
      peminjam: 'tess',
      tanggalPermintaan: '24 Juni 2025 - 12:48',
      tanggalPeminjaman: '24 Juni 2025 - 12:48',
      status: 'Tolak',
      jumlahBarang: 2,
      keterangan: 'karyawan'
    }
  ]

  // States
  const [dataPermintaan, setDataPermintaan] = useState<PermintaanPeminjaman[]>(initialData)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchValue, setSearchValue] = useState('')

  // Handlers
  const handleTerima = (id: number) => {
    setDataPermintaan(prev => prev.map(item => (item.id === id ? { ...item, status: 'Terima' as const } : item)))
  }

  const handleTolak = (id: number) => {
    setDataPermintaan(prev => prev.map(item => (item.id === id ? { ...item, status: 'Tolak' as const } : item)))
  }

  // Filter data
  const filteredData = dataPermintaan.filter(item => {
    const matchSearch =
      item.nomorPermintaan.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.peminjam.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.namaBarang.toLowerCase().includes(searchValue.toLowerCase())

    return matchSearch
  })

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <>
      {/* Header dengan Show entries dan Search */}
      <Box
        sx={{
          px: 0,
          py: 4,
          display: 'flex',
          gap: 2,
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <Box>
            <Typography variant='body2' sx={{ mb: 1 }}>
              Show
            </Typography>
            <TextField
              select
              size='small'
              defaultValue={10}
              onChange={e => setRowsPerPage(parseInt(e.target.value))}
              sx={{ width: 80 }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </TextField>
            <Typography variant='body2' sx={{ display: 'inline-block', ml: 1 }}>
              entries
            </Typography>
          </Box>
        </Box>

        <Box>
          <TextField
            placeholder='Search:'
            size='small'
            value={searchValue}
            onChange={e => {
              setSearchValue(e.target.value)
              setPage(0)
            }}
            sx={{ width: 250 }}
          />
        </Box>
      </Box>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama Barang</th>
              <th>Nama Peminjam</th>
              <th>Jabatan/Bidang</th>
              <th>Jml Barang</th>
              <th>Tgl. Pinjam</th>
              <th>Tgl. Kembali</th>
              <th>Opsi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={row.id}>
                <td className='!plb-1'>
                  <Typography>{page * rowsPerPage + index + 1}</Typography>
                </td>
                <td className='!plb-1'>
                  <Typography>{row.namaBarang}</Typography>
                </td>
                <td className='!plb-1'>
                  <Typography>{row.peminjam}</Typography>
                </td>
                <td className='!plb-1'>
                  <Typography>{row.keterangan}</Typography>
                </td>
                <td className='!plb-1'>
                  <Typography>{row.jumlahBarang}</Typography>
                </td>
                <td className='!plb-1'>
                  <Typography>{row.tanggalPermintaan}</Typography>
                </td>
                <td className='!plb-1'>
                  <Typography>{row.tanggalPeminjaman}</Typography>
                </td>
                <td className='!plb-1'>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant='contained'
                      color='success'
                      size='small'
                      onClick={() => handleTerima(row.id)}
                      disabled={row.status === 'Terima'}
                      sx={{ minWidth: 65, fontSize: '0.75rem' }}
                    >
                      ✓ Terima
                    </Button>
                    <Button
                      variant='contained'
                      color='error'
                      size='small'
                      onClick={() => handleTolak(row.id)}
                      disabled={row.status === 'Tolak'}
                      sx={{ minWidth: 65, fontSize: '0.75rem' }}
                    >
                      ✕ Tolak
                    </Button>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 0, py: 4 }}>
        <Typography variant='body2' color='textSecondary'>
          Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of{' '}
          {filteredData.length} entries
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant='outlined' size='small' onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
            Previous
          </Button>
          <Button variant={page === 0 ? 'contained' : 'outlined'} size='small' disabled>
            {page + 1}
          </Button>
          <Button
            variant='outlined'
            size='small'
            onClick={() => setPage(page + 1)}
            disabled={(page + 1) * rowsPerPage >= filteredData.length}
          >
            Next
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default TambahListTable
