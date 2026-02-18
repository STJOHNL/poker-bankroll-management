import { Link } from 'react-router-dom'
import { FaCircleExclamation } from 'react-icons/fa6'
import PageTitle from '../components/PageTitle'

const NotFound = () => {
  return (
    <>
      <PageTitle title='404 Not Found' hideTitle />
      <div className='error-page'>
        <FaCircleExclamation className='error-page__icon' />
        <h1 className='error-page__code'>404</h1>
        <h2 className='error-page__title'>Page Not Found</h2>
        <p className='error-page__message'>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to='/dashboard' className='btn btn--primary'>Back to Dashboard</Link>
      </div>
    </>
  )
}

export default NotFound
