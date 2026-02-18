import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
// Custom Hooks
import { useSession } from '../../hooks/useSession'

const CashForm = ({ onSubmitCallback, parentData, prefillData, buttonText, showStatus }) => {
  const { createSession, updateSession } = useSession()
  const navigate = useNavigate()

  // Convert ISO date string or Date object to datetime-local format
  const getLocalDateTime = (date) => {
    const d = date ? new Date(date) : new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  // Setup fields: prefer parentData (edit), then prefillData (duplicate), then empty
  const initSource = parentData || prefillData || {}

  // Form data
  const [buyin, setBuyin] = useState(initSource.buyin || '')
  const [blinds, setBlinds] = useState(initSource.blinds || '')
  const [game, setGame] = useState(initSource.game || 'Holdem')
  const [venue, setVenue] = useState(initSource.venue || '')
  const [tableSize, setTableSize] = useState(initSource.tableSize || 8)
  const [expenses, setExpenses] = useState(initSource.expenses || '')
  // Result fields: only carry over when editing (parentData), not when duplicating
  const [startTime, setStartTime] = useState(parentData?.startTime ? getLocalDateTime(parentData.startTime) : getLocalDateTime())
  const [endTime, setEndTime] = useState(parentData?.endTime ? getLocalDateTime(parentData.endTime) : '')
  const [cashout, setCashout] = useState(parentData?.cashout || '')
  const [rebuys, setRebuys] = useState(parentData?.rebuys || '')
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
      cashout,
      expenses,
      rebuys,
      notes
    }

    let res = null

    if (parentData) {
      res = await updateSession(formData)
      if (res) {
        toast.success('Changes saved')
      }
    } else {
      res = await createSession(formData)
      if (res) {
        toast.success('Go get some stacks!')
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
      <h2 className='heading-lg'>Cash Game Session</h2>

      {/* Game Details Section */}
      <div className='form__section'>
        <h3 className='form__section-title'>Game Details</h3>
        <div className='form__grid form__grid--2col'>
          <div className='form__field'>
            <label htmlFor='game'>Game Type</label>
            <select
              name='game'
              id='game'
              value={game}
              onChange={e => setGame(e.target.value)}
              required>
              <option value='Holdem'>Holdem</option>
              <option value='PLO'>PLO</option>
            </select>
          </div>
          <div className='form__field'>
            <label htmlFor='blinds'>Blinds</label>
            <input
              type='text'
              name='blinds'
              id='blinds'
              list='blinds-list'
              value={blinds}
              onChange={e => setBlinds(e.target.value)}
              placeholder='Select or type custom blinds'
              required
            />
            <datalist id='blinds-list'>
              <option value='0.01/0.02' />
              <option value='0.05/0.10 (0.05)' />
              <option value='0.50/1' />
              <option value='1/2' />
              <option value='1/3' />
              <option value='2/5' />
              <option value='5/10' />
              <option value='10/20' />
              <option value='10/25' />
              <option value='25/50' />
            </datalist>
          </div>
          <div className='form__field'>
            <label htmlFor='venue'>Venue</label>
            <input
              type='text'
              name='venue'
              id='venue'
              list='venue-list'
              value={venue}
              onChange={e => setVenue(e.target.value)}
              placeholder='Select or type custom venue'
              required
            />
            <datalist id='venue-list'>
              <option value='Online - WPT Gold' />
              <option value='Rivers Portsmouth' />
              <option value='Home Game' />
            </datalist>
          </div>
          <div className='form__field'>
            <label htmlFor='tableSize'>Table Size</label>
            <input
              type='number'
              name='tableSize'
              id='tableSize'
              value={tableSize}
              onChange={e => setTableSize(e.target.value)}
              min='2'
              max='10'
              required
            />
          </div>
        </div>
      </div>

      {/* Buy-in & Expenses Section */}
      <div className='form__section'>
        <h3 className='form__section-title'>Financial Details</h3>
        <div className='form__grid form__grid--2col'>
          <div className='form__field'>
            <label htmlFor='buyin'>Buy-in ($)</label>
            <input
              type='number'
              name='buyin'
              id='buyin'
              value={buyin}
              onChange={e => setBuyin(e.target.value)}
              placeholder='0.00'
              step='0.01'
              min='0'
              autoFocus
              required
            />
          </div>
          <div className='form__field'>
            <label htmlFor='rebuys'>Rebuys ($)</label>
            <input
              type='number'
              name='rebuys'
              id='rebuys'
              value={rebuys}
              onChange={e => setRebuys(e.target.value)}
              placeholder='0.00'
              step='0.01'
              min='0'
            />
          </div>
          <div className='form__field'>
            <label htmlFor='expenses'>Expenses ($)</label>
            <input
              type='number'
              name='expenses'
              id='expenses'
              value={expenses}
              onChange={e => setExpenses(e.target.value)}
              placeholder='0.00'
              step='0.01'
              min='0'
            />
          </div>
          <div className='form__field'>
            <label htmlFor='cashout'>Cash Out ($)</label>
            <input
              type='number'
              name='cashout'
              id='cashout'
              value={cashout}
              onChange={e => setCashout(e.target.value)}
              placeholder='0.00'
              step='0.01'
              min='0'
            />
          </div>
        </div>
      </div>

      {/* Time Section */}
      <div className='form__section'>
        <h3 className='form__section-title'>Session Time</h3>
        <div className='form__grid form__grid--2col'>
          <div className='form__field'>
            <label htmlFor='startTime'>Start Time</label>
            <input
              type='datetime-local'
              name='startTime'
              id='startTime'
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className='form__field'>
            <label htmlFor='endTime'>End Time</label>
            <input
              type='datetime-local'
              name='endTime'
              id='endTime'
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className='form__section'>
        <div className='form__field form__field--full'>
          <label htmlFor='notes'>Notes</label>
          <textarea
            name='notes'
            id='notes'
            onChange={e => setNotes(e.target.value)}
            value={notes}
            placeholder='Add any notes about this session...'></textarea>
        </div>
      </div>

      <button type='submit'>{buttonText}</button>
    </form>
  )
}

export default CashForm
