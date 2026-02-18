import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaPen, FaTrash } from 'react-icons/fa6'
import toast from 'react-hot-toast'
// Components
import PageTitle from '../components/PageTitle'
import Loader from '../components/Loader'
import CashForm from '../components/forms/CashForm'
import TournamentForm from '../components/forms/TournamentForm'
// Hooks
import { useSession } from '../hooks/useSession'

const Session = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getSessionById, deleteSession } = useSession()

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const fetchSession = async () => {
      const data = await getSessionById(id)
      if (data) setSession(data)
      setLoading(false)
    }
    fetchSession()
  }, [id])

  const handleUpdate = (updatedSession) => {
    setSession(updatedSession)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    const result = await deleteSession(id)
    if (result) {
      toast.success('Session deleted')
      navigate('/dashboard')
    }
  }

  const calcProfit = (s) => {
    const buyin = parseFloat(s.buyin) || 0
    const expenses = parseFloat(s.expenses) || 0
    const cashout = parseFloat(s.cashout) || 0
    if (s.type === 'cash') {
      return cashout - (buyin + (parseFloat(s.rebuys) || 0) + expenses)
    }
    return cashout + (parseFloat(s.bountiesCollected) || 0) - (buyin + (parseFloat(s.addonsCost) || 0) + expenses)
  }

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(num)
  }

  const formatDate = (date) => {
    if (!date) return '—'
    return new Date(date).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    })
  }

  const formatDuration = (start, end) => {
    if (!start) return '—'
    const diff = (end ? new Date(end) : new Date()) - new Date(start)
    const h = Math.floor(diff / (1000 * 60 * 60))
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${h}h ${m}m`
  }

  if (loading) return <Loader />

  if (!session) {
    return (
      <>
        <PageTitle title='Session Not Found' />
        <p>Session not found.</p>
        <button type='button' className='session-detail__back' onClick={() => navigate('/dashboard')}>
          <FaArrowLeft /> Dashboard
        </button>
      </>
    )
  }

  const isActive = !session.endTime
  const profit = calcProfit(session)
  const isCash = session.type === 'cash'
  const title = isCash ? `${session.game} — ${session.blinds}` : session.name

  return (
    <>
      <PageTitle title={isActive ? 'Active Session' : 'Session Details'} />

      <button type='button' className='session-detail__back' onClick={() => navigate('/dashboard')}>
        <FaArrowLeft /> Dashboard
      </button>

      {/* Header */}
      <div className='session-detail__header'>
        <div className='session-detail__header-left'>
          <span className={`session-history__badge session-history__badge--${session.type}`}>
            {session.type}
          </span>
          <h2 className='session-detail__name'>{title}</h2>
          <span className='session-detail__venue'>{session.venue}</span>
        </div>
        <div className='session-detail__header-right'>
          {isActive ? (
            <span className='session-detail__status session-detail__status--live'>● Live</span>
          ) : (
            <span className={`session-detail__status ${profit >= 0 ? 'session-detail__status--win' : 'session-detail__status--loss'}`}>
              {profit >= 0 ? 'Win' : 'Loss'}
            </span>
          )}
        </div>
      </div>

      {/* Key Stats */}
      <div className='stats-row'>
        <div className='stat-box'>
          <span className='stat-box__label'>Buy-in</span>
          <span className='stat-box__value'>{formatCurrency(session.buyin)}</span>
        </div>

        {isCash && parseFloat(session.rebuys) > 0 && (
          <div className='stat-box'>
            <span className='stat-box__label'>Rebuys</span>
            <span className='stat-box__value'>{formatCurrency(session.rebuys)}</span>
          </div>
        )}

        {!isCash && parseFloat(session.addonsCost) > 0 && (
          <div className='stat-box'>
            <span className='stat-box__label'>Add-ons</span>
            <span className='stat-box__value'>{formatCurrency(session.addonsCost)}</span>
          </div>
        )}

        {!isCash && parseFloat(session.bountiesCollected) > 0 && (
          <div className='stat-box'>
            <span className='stat-box__label'>Bounties</span>
            <span className='stat-box__value'>{formatCurrency(session.bountiesCollected)}</span>
          </div>
        )}

        <div className='stat-box'>
          <span className='stat-box__label'>Duration</span>
          <span className='stat-box__value'>{formatDuration(session.startTime, session.endTime)}</span>
        </div>

        {parseFloat(session.cashout) > 0 && (
          <div className='stat-box'>
            <span className='stat-box__label'>Cash Out</span>
            <span className='stat-box__value'>{formatCurrency(session.cashout)}</span>
          </div>
        )}

        {!isActive && (
          <div className='stat-box'>
            <span className='stat-box__label'>P / L</span>
            <span className={`stat-box__value ${profit >= 0 ? 'success' : 'error'}`}>
              {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
            </span>
          </div>
        )}
      </div>

      {/* View / Edit toggle */}
      {!isEditing ? (
        <>
          {/* Info Card */}
          <div className='session-detail__info'>
            <h3>Session Details</h3>
            <div className='session-detail__info-grid'>
              <div className='session-detail__info-item'>
                <span className='session-detail__info-label'>Start</span>
                <span className='session-detail__info-value'>{formatDate(session.startTime)}</span>
              </div>
              {session.endTime && (
                <div className='session-detail__info-item'>
                  <span className='session-detail__info-label'>End</span>
                  <span className='session-detail__info-value'>{formatDate(session.endTime)}</span>
                </div>
              )}
              <div className='session-detail__info-item'>
                <span className='session-detail__info-label'>Game</span>
                <span className='session-detail__info-value'>{session.game}</span>
              </div>
              <div className='session-detail__info-item'>
                <span className='session-detail__info-label'>Table Size</span>
                <span className='session-detail__info-value'>{session.tableSize} players</span>
              </div>
              {parseFloat(session.expenses) > 0 && (
                <div className='session-detail__info-item'>
                  <span className='session-detail__info-label'>Expenses</span>
                  <span className='session-detail__info-value'>{formatCurrency(session.expenses)}</span>
                </div>
              )}
              {!isCash && session.guarantee && (
                <div className='session-detail__info-item'>
                  <span className='session-detail__info-label'>Guarantee</span>
                  <span className='session-detail__info-value'>{session.guarantee}</span>
                </div>
              )}
              {!isCash && session.startingStack && (
                <div className='session-detail__info-item'>
                  <span className='session-detail__info-label'>Starting Stack</span>
                  <span className='session-detail__info-value'>{session.startingStack}</span>
                </div>
              )}
              {!isCash && session.totalPlayers && (
                <div className='session-detail__info-item'>
                  <span className='session-detail__info-label'>Players</span>
                  <span className='session-detail__info-value'>{session.totalPlayers}</span>
                </div>
              )}
              {!isCash && session.finishPosition && (
                <div className='session-detail__info-item'>
                  <span className='session-detail__info-label'>Finish</span>
                  <span className='session-detail__info-value'>#{session.finishPosition} of {session.totalPlayers || '?'}</span>
                </div>
              )}
            </div>

            {session.notes && (
              <div className='session-detail__notes'>
                <span className='session-detail__info-label'>Notes</span>
                <p>{session.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className='session-detail__actions'>
            <button type='button' className='session-detail__action-btn' onClick={() => setIsEditing(true)}>
              <FaPen /> Edit
            </button>
            <button type='button' className='session-detail__action-btn session-detail__action-btn--danger' onClick={() => setShowDeleteConfirm(true)}>
              <FaTrash /> Delete
            </button>
          </div>
        </>
      ) : (
        /* Edit mode */
        <div className='session-detail__edit'>
          <div className='session-detail__edit-header'>
            <h3>Edit Session</h3>
            <button type='button' className='session-detail__action-btn' onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
          {isCash ? (
            <CashForm parentData={session} buttonText='Save Changes' onSubmitCallback={handleUpdate} />
          ) : (
            <TournamentForm parentData={session} buttonText='Save Changes' onSubmitCallback={handleUpdate} />
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className='end-modal-overlay' onClick={() => setShowDeleteConfirm(false)}>
          <div className='end-modal' onClick={e => e.stopPropagation()}>
            <h3>Delete Session?</h3>
            <p>This action cannot be undone.</p>
            <div className='end-modal__actions'>
              <button type='button' className='end-modal__cancel' onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button type='submit' onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Session
