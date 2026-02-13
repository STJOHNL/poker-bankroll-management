import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
// Context
import { useUserContext } from '../../context/UserContext'
// Custom Hooks
import { useSupport } from '../../hooks/useSupport'

const CashForm = ({ onSubmitCallback, parentData, buttonText, showStatus }) => {
  const { user } = useUserContext()
  const { createSupportTicket, updateSupportTicket } = useSupport()
  const navigate = useNavigate()

  // Form data
  const [buyin, setBuyin] = useState(parentData?.buyin || '')
  const [blinds, setBlinds] = useState(parentData?.blinds || '')
  const [game, setGame] = useState(parentData?.game || 'Pending')
  const [venue, setVenue] = useState(parentData?.venue || 'Pending')
  const [tableSize, setTableSize] = useState(parentData?.tableSize || 'Pending')
  const [startTime, setStartTime] = useState(parentData?.startTime || 'Pending')
  const [endTime, setEndTime] = useState(parentData?.endTime || 'Pending')
  const [expenses, setExpenses] = useState(parentData?.expenses || 'Pending')
  const [rebuys, setRebuys] = useState(parentData?.rebuys || 'Pending')
  const [notes, setNotes] = useState(parentData?.notes || '')

  const handleSubmit = async e => {
    e.preventDefault()

    const formData = {
      id: parentData?._id || '',
      type: 'cash',
      buyin,
      blinds,
      game,
      venue,
      tableSize,
      startTime,
      endTime,
      expenses,
      rebuys
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
      <h2 className='heading-lg'>Cash</h2>
      <div>
        <label htmlFor='buyin'>Buyin</label>
        <input
          type='number'
          name='buyin'
          id='buyin'
          autoFocus
          required
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

export default CashForm
