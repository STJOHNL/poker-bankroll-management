import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTrophy, FaRegClock, FaArrowTrendUp, FaArrowTrendDown, FaPersonFallingBurst, FaMoneyBillTrendUp, FaRectangleXmark } from 'react-icons/fa6'
import { useSession } from '../hooks/useSession'

const TournamentCard = ({ session, onUpdate }) => {
  const navigate = useNavigate()
  const { updateSession } = useSession()
  const [showBountyInput, setShowBountyInput] = useState(false)
  const [bountyInput, setBountyInput] = useState('')
  const [showAddonInput, setShowAddonInput] = useState(false)
  const [addonInput, setAddonInput] = useState('')
  const [showEndModal, setShowEndModal] = useState(false)
  const [cashoutInput, setCashoutInput] = useState('')

  const formatDuration = () => {
    const start = new Date(session.startTime)
    const end = session.endTime ? new Date(session.endTime) : new Date()
    const diff = end - start
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(num)
  }

  const totalCost = (parseFloat(session.buyin) || 0) +
    (parseFloat(session.expenses) || 0) +
    (parseFloat(session.addonsCost) || 0)

  const bountiesEarned = parseFloat(session.bountiesCollected) || 0

  const profit = session.cashout != null
    ? parseFloat(session.cashout) + bountiesEarned - totalCost
    : bountiesEarned - totalCost
  const isProfit = profit >= 0

  const previewProfit = cashoutInput !== '' ? parseFloat(cashoutInput) + bountiesEarned - totalCost : null
  const previewIsProfit = previewProfit !== null && previewProfit >= 0

  const handleBountyClick = (e) => {
    e.stopPropagation()
    setShowBountyInput(true)
  }

  const handleBountyKeyDown = async (e) => {
    e.stopPropagation()
    if (e.key === 'Enter') {
      const added = parseFloat(bountyInput)
      if (!isNaN(added) && added > 0) {
        const updated = await updateSession({
          ...session,
          id: session._id,
          bountiesCollected: (parseFloat(session.bountiesCollected) || 0) + added
        })
        if (updated) onUpdate?.(updated)
      }
      setShowBountyInput(false)
      setBountyInput('')
    }
    if (e.key === 'Escape') {
      setShowBountyInput(false)
      setBountyInput('')
    }
  }

  const handleAddonClick = (e) => {
    e.stopPropagation()
    setShowAddonInput(true)
  }

  const handleAddonKeyDown = async (e) => {
    e.stopPropagation()
    if (e.key === 'Enter') {
      const added = parseFloat(addonInput)
      if (!isNaN(added) && added > 0) {
        const updated = await updateSession({
          ...session,
          id: session._id,
          addonsCost: (parseFloat(session.addonsCost) || 0) + added
        })
        if (updated) onUpdate?.(updated)
      }
      setShowAddonInput(false)
      setAddonInput('')
    }
    if (e.key === 'Escape') {
      setShowAddonInput(false)
      setAddonInput('')
    }
  }

  const handleEndClick = (e) => {
    e.stopPropagation()
    setShowEndModal(true)
  }

  const handleEndSubmit = async (e) => {
    e.preventDefault()
    const cashout = parseFloat(cashoutInput)
    if (isNaN(cashout) || cashout < 0) return
    const updated = await updateSession({
      ...session,
      id: session._id,
      endTime: new Date().toISOString(),
      cashout
    })
    if (updated) onUpdate?.(updated)
    setShowEndModal(false)
    setCashoutInput('')
  }

  return (
    <>
      <div className='session-card' onClick={() => navigate(`/session/${session._id}`)}>

        <div className='session-card__section'>
          <FaTrophy className='session-card__icon' />
          <span className='session-card__label'>Tournament</span>
          <span className='session-card__value'>{session.name}</span>
        </div>

        <div className='session-card__section'>
          <FaRegClock className='session-card__icon' />
          <span className='session-card__label'>Duration</span>
          <span className='session-card__value'>{formatDuration()}</span>
        </div>

        <div className='session-card__section'>
          {isProfit
            ? <FaArrowTrendUp className='session-card__icon session-card__icon--up' />
            : <FaArrowTrendDown className='session-card__icon session-card__icon--down' />}
          <span className='session-card__label'>P/L</span>
          <span className={`session-card__value ${isProfit ? 'success' : 'error'}`}>
            {formatCurrency(profit)}
          </span>
        </div>

        {session.bounties && (
          <div className='session-card__section session-card__section--action' onClick={handleBountyClick} title='Click to add a bounty'>
            <FaPersonFallingBurst className='session-card__icon' />
            <span className='session-card__label'>KO/PKO</span>
            {showBountyInput ? (
              <input
                className='session-card__inline-input'
                type='number'
                placeholder='Amount'
                value={bountyInput}
                autoFocus
                onClick={e => e.stopPropagation()}
                onChange={e => setBountyInput(e.target.value)}
                onKeyDown={handleBountyKeyDown}
                onBlur={() => { setShowBountyInput(false); setBountyInput('') }}
              />
            ) : (
              <span className='session-card__value'>{formatCurrency(session.bountiesCollected)}</span>
            )}
          </div>
        )}

        {session.addons && (
          <div className='session-card__section session-card__section--action' onClick={handleAddonClick} title='Click to add an addon'>
            <FaMoneyBillTrendUp className='session-card__icon' />
            <span className='session-card__label'>Add-on</span>
            {showAddonInput ? (
              <input
                className='session-card__inline-input'
                type='number'
                placeholder='Cost'
                value={addonInput}
                autoFocus
                onClick={e => e.stopPropagation()}
                onChange={e => setAddonInput(e.target.value)}
                onKeyDown={handleAddonKeyDown}
                onBlur={() => { setShowAddonInput(false); setAddonInput('') }}
              />
            ) : (
              <span className='session-card__value'>{formatCurrency(session.addonsCost)}</span>
            )}
          </div>
        )}

        <button className='session-card__end-btn' onClick={handleEndClick}>
          <FaRectangleXmark />
          <span>End</span>
        </button>

      </div>

      {showEndModal && (
        <div className='end-modal-overlay' onClick={() => setShowEndModal(false)}>
          <div className='end-modal' onClick={e => e.stopPropagation()}>
            <h3>{session.name}</h3>
            <p>Total invested: <strong>{formatCurrency(totalCost)}</strong></p>

            <form onSubmit={handleEndSubmit}>
              <label htmlFor='cashout'>Cashout amount</label>
              <input
                id='cashout'
                type='number'
                placeholder='0'
                value={cashoutInput}
                autoFocus
                onChange={e => setCashoutInput(e.target.value)}
                min='0'
                step='0.01'
              />

              {previewProfit !== null && (
                <p className={`end-modal__preview ${previewIsProfit ? 'success' : 'error'}`}>
                  {previewIsProfit ? '+' : ''}{formatCurrency(previewProfit)}
                </p>
              )}

              <div className='end-modal__actions'>
                <button type='button' className='end-modal__cancel' onClick={() => setShowEndModal(false)}>
                  Cancel
                </button>
                <button type='submit'>End Session</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default TournamentCard
