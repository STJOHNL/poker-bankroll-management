import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
// Custom Hooks
import { useAuth } from '../hooks/useAuth'
// Components
import PageTitle from '../components/PageTitle'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { resetPassword } = useAuth()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
    } else {
      const formData = { password, confirmPassword, token }
      const res = await resetPassword(formData)
      if (res) {
        toast.success('Password updated!')
        navigate('/')
      }
    }
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <>
      <PageTitle title='Reset Password' hideTitle />
      <div className='auth-page'>
        <form onSubmit={handleSubmit}>
          <h2>New Password</h2>
          <div className='form__section'>
            <div className='form__field'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='New password'
                onChange={e => setPassword(e.target.value)}
                value={password}
                required
                autoFocus
              />
            </div>
            <div className='form__field'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input
                type='password'
                name='confirmPassword'
                id='confirmPassword'
                placeholder='Confirm new password'
                onChange={e => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
            </div>
          </div>
          <button type='submit'>Update Password</button>
        </form>
        <div className='auth-page__links'>
          <Link to='/sign-in'>Back to Sign In</Link>
        </div>
      </div>
    </>
  )
}

export default ResetPassword
