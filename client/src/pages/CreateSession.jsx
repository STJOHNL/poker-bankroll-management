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
      <PageTitle
        title={'New Session'}
        hideTitle
      />
      <div className='session__container'>
        {/* Session Type Tabs */}
        <div className='session__tabs'>
          <button
            className={`session__tab ${type === 'cash' ? 'session__tab--active' : ''}`}
            onClick={() => setType('cash')}>
            Cash Game
          </button>
          <button
            className={`session__tab ${type === 'tournament' ? 'session__tab--active' : ''}`}
            onClick={() => setType('tournament')}>
            Tournament
          </button>
        </div>

        {/* Forms */}
        {type === 'cash' && (
          <CashForm
            buttonText={'Start Session'}
            onSubmitCallback={handleSubmit}
          />
        )}
        {type === 'tournament' && (
          <TournamentForm
            buttonText={'Start Session'}
            onSubmitCallback={handleSubmit}
          />
        )}
      </div>
    </>
  )
}

export default CreateSession
