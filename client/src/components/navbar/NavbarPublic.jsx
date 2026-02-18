import { NavLink } from 'react-router-dom'
import { FaCoins } from 'react-icons/fa6'

const NavbarPublic = () => {
  return (
    <nav className='navbar'>
      <NavLink to='/' className='navbar__brand'>
        <FaCoins />
        <span>Poker Tracker</span>
      </NavLink>
      <div className='navbar__links'>
        <NavLink
          to='/sign-in'
          className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}>
          <span>Sign In</span>
        </NavLink>
        <NavLink to='/sign-up' className='navbar__cta'>
          Sign Up
        </NavLink>
      </div>
    </nav>
  )
}

export default NavbarPublic
