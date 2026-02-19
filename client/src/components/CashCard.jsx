import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCoins, FaRegClock, FaArrowTrendUp, FaArrowTrendDown, FaArrowsRotate, FaRectangleXmark } from 'react-icons/fa6'
import { useSession } from '../hooks/useSession'

const CashCard = ({ session, onUpdate }) => {
  const navigate = useNavigate()
  const { updateSession } = useSession()
  const [showRebuyInput, setShowRebuyInput] = useState(false)
  const [rebuyInput, setRebuyInput] = useState('')
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
    (parseFloat(session.rebuys) || 0) +
    (parseFloat(session.expenses) || 0)

  const profit = session.cashout != null
    ? parseFloat(session.cashout) - totalCost
    : -totalCost
  const isProfit = profit >= 0

  const previewProfit = cashoutInput !== '' ? parseFloat(cashoutInput) - totalCost : null
  const previewIsProfit = previewProfit !== null && previewProfit >= 0

  const handleRebuyClick = (e) => {
    e.stopPropagation()
    setShowRebuyInput(true)
  }

  const handleRebuyKeyDown = async (e) => {
    e.stopPropagation()
    if (e.key === 'Enter') {
      const added = parseFloat(rebuyInput)
      if (!isNaN(added) && added > 0) {
        const updated = await updateSession({
          ...session,
          id: session._id,
          rebuys: (parseFloat(session.rebuys) || 0) + added
        })
        if (updated) onUpdate?.(updated)
      }
      setShowRebuyInput(false)
      setRebuyInput('')
    }
    if (e.key === 'Escape') {
      setShowRebuyInput(false)
      setRebuyInput('')
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
          <FaCoins className='session-card__icon' />
          <span className='session-card__label'>Cash</span>
          <span className='session-card__value'>{session.game} — {session.blinds}</span>
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

        <div className='session-card__section session-card__section--action' onClick={handleRebuyClick} title='Click to add a rebuy'>
          <FaArrowsRotate className='session-card__icon' />
          <span className='session-card__label'>Rebuys</span>
          {showRebuyInput ? (
            <input
              className='session-card__inline-input'
              type='number'
              placeholder='Amount'
              value={rebuyInput}
              autoFocus
              onClick={e => e.stopPropagation()}
              onChange={e => setRebuyInput(e.target.value)}
              onKeyDown={handleRebuyKeyDown}
              onBlur={() => { setShowRebuyInput(false); setRebuyInput('') }}
            />
          ) : (
            <span className='session-card__value'>{formatCurrency(session.rebuys)}</span>
          )}
        </div>

        <button className='session-card__end-btn' onClick={handleEndClick}>
          <FaRectangleXmark />
          <span>End</span>
        </button>

      </div>

      {showEndModal && (
        <div className='end-modal-overlay' onClick={() => setShowEndModal(false)}>
          <div className='end-modal' onClick={e => e.stopPropagation()}>
            <h3>{session.game} — {session.blinds}</h3>
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

export default CashCard
