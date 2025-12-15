'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

const Register = ({ mode }: { mode: Mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    id_admin: '',
    nama: '',
    email: '',
    password: '',
    termsAccepted: false
  })

  // Hooks
  const router = useRouter()
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!formData.id_admin || !formData.nama || !formData.email || !formData.password) {
      setError('Semua field yang ditandai (*) harus diisi')

      return
    }

    if (!formData.termsAccepted) {
      setError('Anda harus menerima syarat dan ketentuan')

      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id_admin: formData.id_admin,
          nama: formData.nama,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Registrasi gagal')

        return
      }

      setSuccess('Registrasi berhasil! Mengarahkan ke login...')
      setFormData({
        id_admin: '',
        nama: '',
        email: '',
        password: '',
        termsAccepted: false
      })

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setError('Terjadi kesalahan: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center min-bs-[100dvh] relative p-6'>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/' className='flex justify-center items-start mbe-6'>
            <Logo />
          </Link>
          <Typography variant='h4'>Daftar Akun 🚀</Typography>
          <div className='flex flex-col gap-5'>
            <Typography className='mbs-1'>Buat akun untuk mengakses sistem manajemen peminjaman</Typography>

            {error && <Alert severity='error'>{error}</Alert>}
            {success && <Alert severity='success'>{success}</Alert>}

            <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
              <TextField
                autoFocus
                fullWidth
                label='ID Admin*'
                name='id_admin'
                value={formData.id_admin}
                onChange={handleInputChange}
                disabled={loading}
              />
              <TextField
                fullWidth
                label='Nama*'
                name='nama'
                value={formData.nama}
                onChange={handleInputChange}
                disabled={loading}
              />
              <TextField
                fullWidth
                label='Email*'
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
              />
              <TextField
                fullWidth
                label='Password*'
                type={isPasswordShown ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                        disabled={loading}
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name='termsAccepted'
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                }
                label={
                  <>
                    <span>Saya setuju dengan </span>
                    <Link className='text-primary' href='/' onClick={e => e.preventDefault()}>
                      kebijakan privasi & syarat ketentuan
                    </Link>
                  </>
                }
              />
              <Button fullWidth variant='contained' type='submit' disabled={loading}>
                {loading ? <CircularProgress size={24} /> : 'Daftar'}
              </Button>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>Sudah punya akun?</Typography>
                <Typography component={Link} href='/login' color='primary'>
                  Masuk di sini
                </Typography>
              </div>
              <Divider className='gap-3'>Atau</Divider>
              <div className='flex justify-center items-center gap-2'>
                <IconButton size='small' className='text-facebook' disabled={loading}>
                  <i className='ri-facebook-fill' />
                </IconButton>
                <IconButton size='small' className='text-twitter' disabled={loading}>
                  <i className='ri-twitter-fill' />
                </IconButton>
                <IconButton size='small' className='text-github' disabled={loading}>
                  <i className='ri-github-fill' />
                </IconButton>
                <IconButton size='small' className='text-googlePlus' disabled={loading}>
                  <i className='ri-google-fill' />
                </IconButton>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Register
