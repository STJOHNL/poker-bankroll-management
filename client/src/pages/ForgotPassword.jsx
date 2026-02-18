import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
// Custom Hooks
import { useAuth } from '../hooks/useAuth'
// Components
import PageTitle from '../components/PageTitle'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const { forgotPassword } = useAuth()

  const [email, setEmail] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await forgotPassword({ email })
    if (res) {
      toast.success(`Reset link sent to ${email}`)
      navigate('/')
    }
  }

  return (
    <>
      <PageTitle title='Forgot Password' hideTitle />
      <div className='auth-page'>
        <form onSubmit={handleSubmit}>
          <h2>Reset Password</h2>
          <div className='form__section'>
            <div className='form__field'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                name='email'
                id='email'
                placeholder='name@email.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>
          <button type='submit'>Send Reset Link</button>
        </form>
        <div className='auth-page__links'>
          <Link to='/sign-in'>Back to Sign In</Link>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
