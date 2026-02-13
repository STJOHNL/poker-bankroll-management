import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
// Context
import { useUserContext } from '../../context/UserContext'
// Custom Hooks
import { useSupport } from '../../hooks/useSupport'

const TournamentForm = ({ onSubmitCallback, parentData, buttonText, showStatus }) => {
  const { user } = useUserContext()
  const { createSupportTicket, updateSupportTicket } = useSupport()
  const navigate = useNavigate()

  // Form data
  const [name, setName] = useState(parentData?.name || '')
  const [guarantee, setGuarantee] = useState(parentData?.guarantee || '')
  const [buyin, setBuyin] = useState(parentData?.buyin || 0)
  const [blinds, setBlinds] = useState(parentData?.blinds || '')
  const [game, setGame] = useState(parentData?.game || 'Holdem')
  const [venue, setVenue] = useState(parentData?.venue || 'Online')
  const [tableSize, setTableSize] = useState(parentData?.tableSize || 8)
  const [startTime, setStartTime] = useState(parentData?.startTime || new Date())
  const [endTime, setEndTime] = useState(parentData?.endTime || null)
  const [bounties, setBounties] = useState(parentData?.bounties || 0)
  const [addons, setAddons] = useState(parentData?.addons || 0)
  const [totalPlayers, setTotalPlayers] = useState(parentData?.totalPlayers || null)
  const [finishPosition, setFinishPosition] = useState(parentData?.finishPosition || null)

  const handleSubmit = async e => {
    e.preventDefault()

    const formData = {
      id: parentData?._id || '',
      type: 'tournament',
      name,
      guarantee,
      buyin,
      blinds,
      game,
      venue,
      tableSize,
      startTime,
      endTime,
      bounties,
      addons,
      totalPlayers,
      finishPosition
    }

    let res = null

    if (parentData) {
      res = await updateSupportTicket(formData)
      if (res) {
        toast.success('Changes saved')
      }
    } else {
      res = await createSupportTicket(formData)
      if (res) {
        toast.success('Message sent')
        navigate('/dashboard')
      }
    }

    if (onSubmitCallback) {
      // Callback to update the parent component
      onSubmitCallback(res)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='heading-lg'>Tournament</h2>
      <div>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          name='name'
          id='name'
          autoFocus
          required
        />
      </div>
      <div>
        <label htmlFor='buyin'>Buyin</label>
        <input
          type='number'
          name='buyin'
          id='buyin'
          required
        />
      </div>
      <div>
        <label htmlFor='guarantee'>Guarantee</label>
        <input
          type='text'
          name='guarantee'
          id='guarantee'
        />
      </div>
      <div>
        <label htmlFor='blinds'>Blinds</label>
        <input
          type='text'
          name='blinds'
          id='blinds'
          required
        />
      </div>
      <div>
        <label htmlFor='game'>Game</label>
        <select
          name='game'
          id='game'
          onChange={e => setGame(e.target.value)}
          required>
          {game == '' ? <option>Select Game</option> : <option value={game}>{game}</option>}
          <option value='Holdem'>Holdem</option>
          <option value='PLO'>PLO</option>
        </select>
      </div>
      <div>
        <label htmlFor='notes'>Notes</label>
        <textarea
          name='notes'
          id='notes'
          onChange={e => setNotes(e.target.value)}
          value={notes}></textarea>
      </div>
      <div>
        <label htmlFor='status'>Status</label>
        <select
          name='status'
          id='status'
          onChange={e => setStatus(e.target.value)}
          required>
          <option value={status}>{status}</option>
          <option value='Completed'>Completed</option>
          <option value='In Progress'>In Progress</option>
          <option value='Pending'>Pending</option>
          <option value='Planned'>Planned</option>
        </select>
      </div>

      <button>{buttonText}</button>
    </form>
  )
}

export default TournamentForm
