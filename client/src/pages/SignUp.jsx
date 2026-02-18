import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
// Context
import { useUserContext } from '../context/UserContext'
// Custom Hooks
import { useAuth } from '../hooks/useAuth'
// Components
import PageTitle from '../components/PageTitle'

const SignUp = () => {
  const { signUp } = useAuth()
  const { setToken, user } = useUserContext()
  const navigate = useNavigate()

  // Form state
  const [fName, setFName] = useState('')
  const [lName, setLName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user])

  const handleSubmit = async e => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      setPassword('')
      setConfirmPassword('')
    } else {
      const formData = { fName, lName, email, password, confirmPassword }
      const res = await signUp(formData)
      if (res?.token) {
        setToken(res?.token)
        toast.success('Welcome!')
        navigate('/dashboard')
      }
    }
  }

  return (
    <>
      <PageTitle title='Sign Up' hideTitle />
      <div className='auth-page'>
        <form onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <div className='form__section'>
            <div className='form__grid form__grid--2col'>
              <div className='form__field'>
                <label htmlFor='fName'>First Name</label>
                <input
                  type='text'
                  name='fName'
                  id='fName'
                  placeholder='First Name'
                  onChange={e => setFName(e.target.value)}
                  value={fName}
                  required
                  autoFocus
                />
              </div>
              <div className='form__field'>
                <label htmlFor='lName'>Last Name</label>
                <input
                  type='text'
                  name='lName'
                  id='lName'
                  placeholder='Last Name'
                  onChange={e => setLName(e.target.value)}
                  value={lName}
                  required
                />
              </div>
            </div>
            <div className='form__field'>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                name='email'
                id='email'
                placeholder='name@email.com'
                onChange={e => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>
            <div className='form__field'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='Password'
                onChange={e => setPassword(e.target.value)}
                value={password}
                required
              />
            </div>
            <div className='form__field'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input
                type='password'
                name='confirmPassword'
                id='confirmPassword'
                placeholder='Confirm Password'
                onChange={e => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
            </div>
          </div>
          <button type='submit'>Sign Up</button>
        </form>
        <div className='auth-page__links'>
          <Link to='/sign-in'>Already have an account?</Link>
          <Link to='/forgot-password'>Forgot password?</Link>
        </div>
      </div>
    </>
  )
}

export default SignUp
