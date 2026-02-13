import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
// Custom Hooks
import { useSession } from '../../hooks/useSession'

const TournamentForm = ({ onSubmitCallback, parentData, buttonText, showStatus }) => {
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

  // Form data
  const [name, setName] = useState(parentData?.name || '')
  const [guarantee, setGuarantee] = useState(parentData?.guarantee || '')
  const [buyin, setBuyin] = useState(parentData?.buyin || '')
  const [cashout, setCashout] = useState(parentData?.cashout || '')
  const [startingStack, setStartingStack] = useState(parentData?.startingStack || '')
  const [game, setGame] = useState(parentData?.game || 'Holdem')
  const [venue, setVenue] = useState(parentData?.venue || '')
  const [tableSize, setTableSize] = useState(parentData?.tableSize || 8)
  const [startTime, setStartTime] = useState(parentData?.startTime ? getLocalDateTime(parentData.startTime) : getLocalDateTime())
  const [endTime, setEndTime] = useState(parentData?.endTime ? getLocalDateTime(parentData.endTime) : '')
  const [bounties, setBounties] = useState(parentData?.bounties || false)
  const [bountiesCollected, setBountiesCollected] = useState(parentData?.bountiesCollected || '')
  const [addons, setAddons] = useState(parentData?.addons || false)
  const [addonsCost, setAddonsCost] = useState(parentData?.addonsCost || '')
  const [totalPlayers, setTotalPlayers] = useState(parentData?.totalPlayers || '')
  const [finishPosition, setFinishPosition] = useState(parentData?.finishPosition || '')
  const [notes, setNotes] = useState(parentData?.notes || '')

  const handleSubmit = async e => {
    e.preventDefault()

    const formData = {
      id: parentData?._id || '',
      type: 'tournament',
      name,
      guarantee,
      buyin,
      cashout,
      startingStack,
      game,
      venue,
      tableSize,
      startTime,
      endTime,
      bounties,
      bountiesCollected,
      addons,
      addonsCost,
      totalPlayers,
      finishPosition,
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
        toast.success('Go ship it!')
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
      <h2 className='heading-lg'>Tournament Session</h2>

      {/* Tournament Info Section */}
      <div className='form__section'>
        <h3 className='form__section-title'>Tournament Information</h3>
        <div className='form__grid form__grid--2col'>
          <div className='form__field form__field--full'>
            <label htmlFor='name'>Tournament Name</label>
            <input
              type='text'
              name='name'
              id='name'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='e.g., Sunday Million, Daily Deepstack'
              autoFocus
              required
            />
          </div>
          <div className='form__field'>
            <label htmlFor='venue'>Venue</label>
            <input
              type='text'
              name='venue'
              id='venue'
              list='tournament-venue-list'
              value={venue}
              onChange={e => setVenue(e.target.value)}
              placeholder='Select or type custom venue'
              required
            />
            <datalist id='tournament-venue-list'>
              <option value='Online - PokerStars' />
              <option value='Online - GGPoker' />
              <option value='Online - 888poker' />
              <option value='Online - PartyPoker' />
              <option value='Casino' />
              <option value='Card Room' />
              <option value='Home Game' />
            </datalist>
          </div>
          <div className='form__field'>
            <label htmlFor='guarantee'>Guarantee</label>
            <input
              type='text'
              name='guarantee'
              id='guarantee'
              value={guarantee}
              onChange={e => setGuarantee(e.target.value)}
              placeholder='e.g., $10,000 GTD'
            />
          </div>
        </div>
      </div>

      {/* Game Details Section */}
      <div className='form__section'>
        <h3 className='form__section-title'>Game Details</h3>
        <div className='form__grid form__grid--3col'>
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
            <label htmlFor='startingStack'>Starting Stack</label>
            <input
              type='text'
              name='startingStack'
              id='startingStack'
              list='tournament-starting-stack-list'
              value={startingStack}
              onChange={e => setStartingStack(e.target.value)}
              placeholder='Select or type starting stack (e.g., 10,000)'
              required
            />
            <datalist id='tournament-starting-stack-list'>
              <option value='1000' />
              <option value='5000' />
              <option value='6000' />
              <option value='8000' />
              <option value='10000' />
              <option value='20000' />
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

      {/* Buy-in & Additional Costs Section */}
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
              required
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
          <div className='form__field'>
            <label htmlFor='bounties'>
              <input
                type='checkbox'
                name='bounties'
                id='bounties'
                checked={bounties}
                onChange={e => setBounties(e.target.checked)}
              />
              Bounties Available
            </label>
          </div>
          {bounties && (
            <div className='form__field'>
              <label htmlFor='bountiesCollected'>Bounties Collected</label>
              <input
                type='number'
                name='bountiesCollected'
                id='bountiesCollected'
                value={bountiesCollected}
                onChange={e => setBountiesCollected(e.target.value)}
                placeholder='0'
                min='0'
              />
            </div>
          )}
          <div className='form__field'>
            <label htmlFor='addons'>
              <input
                type='checkbox'
                name='addons'
                id='addons'
                checked={addons}
                onChange={e => setAddons(e.target.checked)}
              />
              Add-ons Available
            </label>
          </div>
          {addons && (
            <div className='form__field'>
              <label htmlFor='addonsCost'>Add-ons Cost ($)</label>
              <input
                type='number'
                name='addonsCost'
                id='addonsCost'
                value={addonsCost}
                onChange={e => setAddonsCost(e.target.value)}
                placeholder='0.00'
                step='0.01'
                min='0'
              />
            </div>
          )}
        </div>
      </div>

      {/* Time Section */}
      <div className='form__section'>
        <h3 className='form__section-title'>Tournament Time</h3>
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

      {/* Results Section */}
      <div className='form__section'>
        <h3 className='form__section-title'>Results</h3>
        <div className='form__grid form__grid--2col'>
          <div className='form__field'>
            <label htmlFor='totalPlayers'>Total Players</label>
            <input
              type='number'
              name='totalPlayers'
              id='totalPlayers'
              value={totalPlayers}
              onChange={e => setTotalPlayers(e.target.value)}
              placeholder='0'
              min='1'
            />
          </div>
          <div className='form__field'>
            <label htmlFor='finishPosition'>Finish Position</label>
            <input
              type='number'
              name='finishPosition'
              id='finishPosition'
              value={finishPosition}
              onChange={e => setFinishPosition(e.target.value)}
              placeholder='0'
              min='1'
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
            placeholder='Add any notes about this tournament...'></textarea>
        </div>
      </div>

      <button type='submit'>{buttonText}</button>
    </form>
  )
}

export default TournamentForm
