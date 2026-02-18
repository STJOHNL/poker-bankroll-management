import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Components
import PageTitle from '../components/PageTitle'
import CashForm from '../components/forms/CashForm'
import TournamentForm from '../components/forms/TournamentForm'

const CreateSession = () => {
  // Router
  const navigate = useNavigate()
  // State
  const [type, setType] = useState('cash')

  // After submitting the form, navigate to dashboard
  const handleSubmit = async e => {
    navigate('/dashboard')
  }

  return (
    <>
      <PageTitle title='New Session' />
      <div className='session-type-tabs'>
        <button
          className={`session-type-tab${type === 'cash' ? ' session-type-tab--active' : ''}`}
          onClick={() => setType('cash')}>
          Cash Game
        </button>
        <button
          className={`session-type-tab${type === 'tournament' ? ' session-type-tab--active' : ''}`}
          onClick={() => setType('tournament')}>
          Tournament
        </button>
      </div>

      {type === 'cash' && (
        <CashForm
          buttonText='Start Session'
          onSubmitCallback={handleSubmit}
        />
      )}
      {type === 'tournament' && (
        <TournamentForm
          buttonText='Start Session'
          onSubmitCallback={handleSubmit}
        />
      )}
    </>
  )
}

export default CreateSession
