import { NavLink } from 'react-router-dom'

const FooterPublic = () => {
  return (
    <footer className='footer'>
      <span className='footer__copy'>© {new Date().getFullYear()} Poker Tracker</span>
      <nav className='footer__links'>
        <NavLink to='/terms'>Terms</NavLink>
        <NavLink to='/privacy-policy'>Privacy</NavLink>
        <NavLink to='/sign-in'>Sign In</NavLink>
      </nav>
    </footer>
  )
}

export default FooterPublic
