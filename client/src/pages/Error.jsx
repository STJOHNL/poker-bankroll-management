import { Link } from 'react-router-dom'
import { FaTriangleExclamation } from 'react-icons/fa6'
import PageTitle from '../components/PageTitle'

const Error = () => {
  return (
    <>
      <PageTitle title='Something went wrong' hideTitle />
      <div className='error-page'>
        <FaTriangleExclamation className='error-page__icon error-page__icon--warning' />
        <h1 className='error-page__code'>Oops</h1>
        <h2 className='error-page__title'>Something Went Wrong</h2>
        <p className='error-page__message'>
          An unexpected error occurred. Please try again or return to the dashboard.
        </p>
        <Link to='/dashboard' className='btn btn--primary'>Back to Dashboard</Link>
      </div>
    </>
  )
}

export default Error
