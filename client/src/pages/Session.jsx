import { useNavigate } from 'react-router-dom'
// Components
import PageTitle from '../components/PageTitle'
import CashForm from '../components/forms/CashForm'
import TournamentForm from '../components/forms/TournamentForm'
import { useState } from 'react'

const Session = () => {
  // Router
  const navigate = useNavigate()
  // State
  const [type, setType] = useState('Cash')

  // After submitting the form, navigate to dashboard
  const handleSubmit = async e => {
    navigate('/dashboard')
  }

  // const handleClick = async val => {
  //   setType(val)
  // }

  return (
    <>
      <PageTitle
        title={'New Session'}
        hideTitle
      />
      <button onClick={() => setType('Cash')}>Cash</button>
      <button onClick={() => setType('Tournament')}>Tournament</button>
      {type == 'Cash' && (
        <CashForm
          buttonText={'Send message'}
          onSubmitCallback={handleSubmit}
        />
      )}
      {type == 'Tournament' && (
        <TournamentForm
          buttonText={'Send message'}
          onSubmitCallback={handleSubmit}
        />
      )}
    </>
  )
}

export default Session
