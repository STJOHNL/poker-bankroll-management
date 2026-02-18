import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// Custom Hooks
import { useUser } from '../hooks/useUser'
// Components
import Loader from '../components/Loader'
import PageTitle from '../components/PageTitle'
import UserForm from '../components/forms/UserForm'

const Profile = () => {
  const { getUserById } = useUser()
  const { id } = useParams()

  const [isLoading, setIsLoading] = useState(false)
  const [formUser, setFormUser] = useState()

  useEffect(() => {
    const fetchUser = async (id) => {
      setIsLoading(true)
      const res = await getUserById(id)
      setFormUser(res)
      setIsLoading(false)
    }
    fetchUser(id)
  }, [id])

  if (isLoading) return <Loader />

  return (
    <>
      <PageTitle
        title={formUser?.fName?.length ? `${formUser.fName} ${formUser.lName}` : 'Profile'}
        hideTitle
      />
      {formUser && (
        <div className='profile-header'>
          <div className='profile-header__avatar'>
            {formUser.fName?.[0]}{formUser.lName?.[0]}
          </div>
          <div className='profile-header__info'>
            <h2 className='profile-header__name'>{formUser.fName} {formUser.lName}</h2>
            <span className='profile-header__email'>{formUser.email}</span>
          </div>
        </div>
      )}
      <UserForm parentData={formUser} buttonText='Save Changes' />
    </>
  )
}

export default Profile
