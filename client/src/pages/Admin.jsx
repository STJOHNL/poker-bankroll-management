import { Link } from 'react-router-dom'
import { FaEnvelopeOpenText, FaUsers, FaGears } from 'react-icons/fa6'
// Components
import PageTitle from '../components/PageTitle'

const Admin = () => {
  return (
    <>
      <PageTitle title='Admin' />
      <div className='admin-grid'>
        <Link to='/support-tickets' className='admin-card'>
          <FaEnvelopeOpenText className='admin-card__icon' />
          <h3>Support Tickets</h3>
          <p>View and manage user support requests</p>
        </Link>
        <div className='admin-card admin-card--disabled'>
          <FaUsers className='admin-card__icon' />
          <h3>Users</h3>
          <p>Manage user accounts and permissions</p>
        </div>
        <div className='admin-card admin-card--disabled'>
          <FaGears className='admin-card__icon' />
          <h3>Settings</h3>
          <p>System configuration and preferences</p>
        </div>
      </div>
    </>
  )
}

export default Admin
