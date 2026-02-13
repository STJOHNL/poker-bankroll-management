import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
      if (data) {
        setSession(data)
        // Auto-enable editing mode for active sessions
        if (!data.endTime) {
          setIsEditing(true)
        }
      }
      setLoading(false)
    }
    fetchSession()
  }, [id])

  // Handle form submission (update)
  const handleUpdate = (updatedSession) => {
    setSession(updatedSession)
    setIsEditing(false)
    toast.success('Session updated successfully!')
  }

  // Handle delete
  const handleDelete = async () => {
    const result = await deleteSession(id)
    if (result) {
      toast.success('Session deleted')
      navigate('/dashboard')
    }
  }

  // Calculate profit/loss
  const calculateProfit = () => {
    if (!session) return 0

    let totalCost = (parseFloat(session.buyin) || 0) +
                    (parseFloat(session.expenses) || 0)

    // Add cash game rebuys
    if (session.type === 'cash') {
      totalCost += (parseFloat(session.rebuys) || 0)
    }

    // Add tournament addons cost
    if (session.type === 'tournament') {
      totalCost += (parseFloat(session.addonsCost) || 0)
    }

    const cashout = parseFloat(session.cashout) || 0

    // Return 0 if no cashout data
    if (!cashout) return 0

    // Profit = cashout - total costs
    return cashout - totalCost
  }

  // Format currency
  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num)
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  // Format duration
  const formatDuration = (start, end) => {
    if (!start) return 'N/A'
    const endTime = end ? new Date(end) : new Date()
    const duration = endTime - new Date(start)
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return <Loader />
  }

  if (!session) {
    return (
      <>
        <PageTitle title='Session Not Found' />
        <div className='error--wrapper'>
          <h2>Session not found</h2>
          <button className='btn' onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </>
    )
  }

  const isActive = !session.endTime
  const profit = calculateProfit()

  return (
    <>
      <PageTitle title={isActive ? 'Active Session' : 'Session Details'} />

      <div className='session-detail'>
        {/* Header with Status Badge */}
        <div className='session-detail__header'>
          <div>
            <h1 className='heading-xl'>
              {session.type === 'tournament' ? session.name : `${session.game} - ${session.blinds}`}
            </h1>
            <span className='session-detail__type'>{session.type} Game</span>
          </div>
          <div className='session-detail__badge-container'>
            {isActive ? (
              <span className='session-detail__badge session-detail__badge--active'>
                Live Session
              </span>
            ) : (
              <span className={`session-detail__badge ${profit >= 0 ? 'session-detail__badge--win' : 'session-detail__badge--loss'}`}>
                {profit >= 0 ? 'Win' : 'Loss'}
              </span>
            )}
          </div>
        </div>

        {/* View Mode */}
        {!isEditing && (
          <>
            {/* Summary Stats */}
            <div className='session-detail__stats'>
              <div className='session-detail__stat-card'>
                <div className='session-detail__stat-label'>Buy-in</div>
                <div className='session-detail__stat-value'>
                  {formatCurrency(session.buyin)}
                </div>
              </div>

              {session.rebuys > 0 && (
                <div className='session-detail__stat-card'>
                  <div className='session-detail__stat-label'>Rebuys</div>
                  <div className='session-detail__stat-value'>
                    {formatCurrency(session.rebuys)}
                  </div>
                </div>
              )}

              {session.expenses > 0 && (
                <div className='session-detail__stat-card'>
                  <div className='session-detail__stat-label'>Expenses</div>
                  <div className='session-detail__stat-value'>
                    {formatCurrency(session.expenses)}
                  </div>
                </div>
              )}

              <div className='session-detail__stat-card'>
                <div className='session-detail__stat-label'>Duration</div>
                <div className='session-detail__stat-value'>
                  {formatDuration(session.startTime, session.endTime)}
                </div>
              </div>

              {session.cashout > 0 && (
                <div className='session-detail__stat-card'>
                  <div className='session-detail__stat-label'>Cash Out</div>
                  <div className='session-detail__stat-value'>
                    {formatCurrency(session.cashout)}
                  </div>
                </div>
              )}

              {!isActive && session.cashout > 0 && (
                <div className='session-detail__stat-card session-detail__stat-card--highlight'>
                  <div className='session-detail__stat-label'>Result</div>
                  <div className={`session-detail__stat-value ${profit >= 0 ? 'success' : 'error'}`}>
                    {formatCurrency(profit)}
                  </div>
                </div>
              )}
            </div>

            {/* Session Details */}
            <div className='session-detail__info-card'>
              <h2 className='heading-md'>Session Information</h2>
              <div className='session-detail__info-grid'>
                <div className='session-detail__info-item'>
                  <span className='session-detail__info-label'>Venue:</span>
                  <span className='session-detail__info-value'>{session.venue}</span>
                </div>
                <div className='session-detail__info-item'>
                  <span className='session-detail__info-label'>Table Size:</span>
                  <span className='session-detail__info-value'>{session.tableSize} players</span>
                </div>
                <div className='session-detail__info-item'>
                  <span className='session-detail__info-label'>Start Time:</span>
                  <span className='session-detail__info-value'>{formatDate(session.startTime)}</span>
                </div>
                {session.endTime && (
                  <div className='session-detail__info-item'>
                    <span className='session-detail__info-label'>End Time:</span>
                    <span className='session-detail__info-value'>{formatDate(session.endTime)}</span>
                  </div>
                )}
              </div>

              {/* Tournament Specific Info */}
              {session.type === 'tournament' && (
                <>
                  <hr />
                  <h3 className='heading-sm'>Tournament Details</h3>
                  <div className='session-detail__info-grid'>
                    {session.guarantee && (
                      <div className='session-detail__info-item'>
                        <span className='session-detail__info-label'>Guarantee:</span>
                        <span className='session-detail__info-value'>{session.guarantee}</span>
                      </div>
                    )}
                    {session.startingStack && (
                      <div className='session-detail__info-item'>
                        <span className='session-detail__info-label'>Starting Stack:</span>
                        <span className='session-detail__info-value'>{session.startingStack}</span>
                      </div>
                    )}
                    {session.totalPlayers && (
                      <div className='session-detail__info-item'>
                        <span className='session-detail__info-label'>Total Players:</span>
                        <span className='session-detail__info-value'>{session.totalPlayers}</span>
                      </div>
                    )}
                    {session.finishPosition && (
                      <div className='session-detail__info-item'>
                        <span className='session-detail__info-label'>Finish Position:</span>
                        <span className='session-detail__info-value'>{session.finishPosition}</span>
                      </div>
                    )}
                    {session.bounties && (
                      <div className='session-detail__info-item'>
                        <span className='session-detail__info-label'>Bounties Collected:</span>
                        <span className='session-detail__info-value'>{session.bountiesCollected || 0}</span>
                      </div>
                    )}
                    {session.addons && session.addonsCost > 0 && (
                      <div className='session-detail__info-item'>
                        <span className='session-detail__info-label'>Add-ons Cost:</span>
                        <span className='session-detail__info-value'>{formatCurrency(session.addonsCost)}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Notes */}
              {session.notes && (
                <>
                  <hr />
                  <h3 className='heading-sm'>Notes</h3>
                  <p className='session-detail__notes'>{session.notes}</p>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className='session-detail__actions'>
              <button
                className='btn btn--secondary'
                onClick={() => setIsEditing(true)}>
                Edit Session
              </button>
              <button
                className='btn btn--danger'
                onClick={() => setShowDeleteConfirm(true)}>
                Delete Session
              </button>
              <button
                className='btn'
                onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </button>
            </div>
          </>
        )}

        {/* Edit Mode */}
        {isEditing && (
          <div className='session-detail__edit-mode'>
            <div className='session-detail__edit-header'>
              <h2 className='heading-md'>
                {isActive ? 'End Session' : 'Edit Session'}
              </h2>
              <button
                className='btn btn--secondary'
                onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>

            {session.type === 'cash' ? (
              <CashForm
                parentData={session}
                buttonText={isActive ? 'End Session' : 'Save Changes'}
                onSubmitCallback={handleUpdate}
              />
            ) : (
              <TournamentForm
                parentData={session}
                buttonText={isActive ? 'End Session' : 'Save Changes'}
                onSubmitCallback={handleUpdate}
              />
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className='modal-overlay' onClick={() => setShowDeleteConfirm(false)}>
            <div className='modal' onClick={(e) => e.stopPropagation()}>
              <h2 className='heading-lg'>Delete Session?</h2>
              <p>Are you sure you want to delete this session? This action cannot be undone.</p>
              <div className='modal__actions'>
                <button
                  className='btn btn--danger'
                  onClick={handleDelete}>
                  Yes, Delete
                </button>
                <button
                  className='btn btn--secondary'
                  onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Session
