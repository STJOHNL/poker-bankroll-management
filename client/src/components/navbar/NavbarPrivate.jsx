import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { FaCoins, FaGauge, FaUser, FaWallet, FaArrowRightFromBracket } from 'react-icons/fa6'
// Context
import { useUserContext } from '../../context/UserContext'
// Custom hooks
import { useAuth } from '../../hooks/useAuth'

const NavbarPrivate = () => {
  const navigate = useNavigate()
  const { user } = useUserContext()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    const userConfirmed = window.confirm('Are you sure you want to log out?')
    try {
      if (userConfirmed) {
        toast.success('See you later!')
        await signOut()
        navigate('/sign-in')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <nav className='navbar'>
      <NavLink to='/dashboard' className='navbar__brand'>
        <FaCoins />
        <span>Poker Tracker</span>
      </NavLink>

      <div className='navbar__links'>
        <NavLink
          to='/dashboard'
          className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
          <FaGauge />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to='/bankroll'
          className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
          <FaWallet />
          <span>Bankroll</span>
        </NavLink>

        <NavLink
          to={`/profile/${user?._id}`}
          className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
          <FaUser />
          <span>Profile</span>
        </NavLink>

        <button className='navbar__logout' onClick={handleSignOut}>
          <FaArrowRightFromBracket />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  )
}

export default NavbarPrivate
