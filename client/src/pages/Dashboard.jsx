import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Components
import PageTitle from '../components/PageTitle'
import Loader from '../components/Loader'
import EndSessionModal from '../components/modals/EndSessionModal'
import QuickActionsModal from '../components/modals/QuickActionsModal'
// Hooks
import { useSession } from '../hooks/useSession'

const Dashboard = () => {
  const { getSessions } = useSession()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [sessionToEnd, setSessionToEnd] = useState(null)
  const [sessionForQuickAction, setSessionForQuickAction] = useState(null)

  useEffect(() => {
    const fetchSessions = async () => {
      const data = await getSessions()
      if (data) {
        setSessions(data)
      }
      setLoading(false)
    }
    fetchSessions()
  }, [])

  // Handle successful session end
  const handleSessionEnded = (updatedSession) => {
    // Update the sessions list with the updated session
    setSessions(sessions.map(s =>
      s._id === updatedSession._id ? updatedSession : s
    ))
  }

  // Handle successful quick action update
  const handleQuickActionUpdate = (updatedSession) => {
    // Update the sessions list with the updated session
    setSessions(sessions.map(s =>
      s._id === updatedSession._id ? updatedSession : s
    ))
  }

  // Check if session has quick actions available
  const hasQuickActions = (session) => {
    if (session.type === 'cash') return true
    if (session.type === 'tournament' && (session.bounties || session.addons)) return true
    return false
  }

  // Filter active sessions (no end time)
  const activeSessions = sessions.filter(session => !session.endTime)

  // Filter completed sessions
  const completedSessions = sessions.filter(session => session.endTime)

  // Calculate stats
  const calculateProfit = (session) => {
    // Return 0 if session isn't complete or no cashout data
    if (!session.endTime || !session.cashout) return 0

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

    // Profit = cashout - total costs
    return cashout - totalCost
  }

  const totalProfit = completedSessions.reduce((sum, session) => sum + calculateProfit(session), 0)
  const totalSessions = completedSessions.length
  const winningSessions = completedSessions.filter(session => calculateProfit(session) > 0).length
  const winRate = totalSessions > 0 ? ((winningSessions / totalSessions) * 100).toFixed(1) : 0
  const avgProfit = totalSessions > 0 ? (totalProfit / totalSessions).toFixed(2) : 0

  // Format currency
  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num)
  }

  // Format duration
  const formatDuration = (start, end) => {
    if (!start || !end) return 'In Progress'
    const duration = new Date(end) - new Date(start)
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <PageTitle title={`Dashboard`} />

      <div className='dashboard__container'>
        {/* Stats Highlights */}
        <div className='dashboard__stats'>
          <div className='stat-card'>
            <div className='stat-card__label'>Current Balance</div>
            <div className={`stat-card__value ${totalProfit >= 0 ? 'success' : 'error'}`}>
              {formatCurrency(totalProfit)}
            </div>
            <div className='stat-card__note'>Total profit/loss</div>
          </div>

          <div className='stat-card'>
            <div className='stat-card__label'>Sessions Played</div>
            <div className='stat-card__value'>{totalSessions}</div>
            <div className='stat-card__note'>{activeSessions.length} active</div>
          </div>

          <div className='stat-card'>
            <div className='stat-card__label'>Win Rate</div>
            <div className='stat-card__value'>{winRate}%</div>
            <div className='stat-card__note'>{winningSessions} winning sessions</div>
          </div>

          <div className='stat-card'>
            <div className='stat-card__label'>Avg per Session</div>
            <div className={`stat-card__value ${avgProfit >= 0 ? 'success' : 'error'}`}>
              {formatCurrency(avgProfit)}
            </div>
            <div className='stat-card__note'>Based on {totalSessions} sessions</div>
          </div>
        </div>

        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <div className='dashboard__section'>
            <h2 className='heading-lg'>Active Sessions</h2>
            <div className='sessions-grid'>
              {activeSessions.map(session => (
                <div key={session._id} className='session-card session-card--active'>
                  <div className='session-card__header'>
                    <span className='session-card__type'>{session.type}</span>
                    <span className='session-card__badge session-card__badge--active'>Live</span>
                  </div>
                  <h3 className='session-card__title'>
                    {session.type === 'tournament' ? session.name : `${session.game} - ${session.blinds}`}
                  </h3>
                  <div className='session-card__info'>
                    <div className='session-card__detail'>
                      <span className='session-card__label'>Venue:</span>
                      <span>{session.venue}</span>
                    </div>
                    <div className='session-card__detail'>
                      <span className='session-card__label'>Buy-in:</span>
                      <span>{formatCurrency(session.buyin)}</span>
                    </div>
                    {session.type === 'cash' && session.rebuys > 0 && (
                      <div className='session-card__detail'>
                        <span className='session-card__label'>Rebuys:</span>
                        <span>{formatCurrency(session.rebuys)}</span>
                      </div>
                    )}
                    {session.type === 'tournament' && session.bountiesCollected > 0 && (
                      <div className='session-card__detail'>
                        <span className='session-card__label'>Bounties:</span>
                        <span>{session.bountiesCollected}</span>
                      </div>
                    )}
                    {session.type === 'tournament' && session.addonsCost > 0 && (
                      <div className='session-card__detail'>
                        <span className='session-card__label'>Add-ons:</span>
                        <span>{formatCurrency(session.addonsCost)}</span>
                      </div>
                    )}
                    <div className='session-card__detail'>
                      <span className='session-card__label'>Started:</span>
                      <span>{new Date(session.startTime).toLocaleString()}</span>
                    </div>
                    <div className='session-card__detail'>
                      <span className='session-card__label'>Duration:</span>
                      <span>{formatDuration(session.startTime, new Date())}</span>
                    </div>
                  </div>
                  <div className='session-card__actions'>
                    {hasQuickActions(session) && (
                      <button
                        className='session-card__action-btn'
                        onClick={() => setSessionForQuickAction(session)}
                        title='Add rebuys, bounties, or addons'>
                        + Quick Actions
                      </button>
                    )}
                    <button
                      className='session-card__link'
                      onClick={() => setSessionToEnd(session)}>
                      End Session →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Completed Sessions */}
        {completedSessions.length > 0 && (
          <div className='dashboard__section'>
            <h2 className='heading-lg'>Recent Sessions</h2>
            <div className='sessions-grid'>
              {completedSessions.slice(0, 6).map(session => {
                const profit = calculateProfit(session)
                return (
                  <div key={session._id} className='session-card'>
                    <div className='session-card__header'>
                      <span className='session-card__type'>{session.type}</span>
                      <span className={`session-card__badge ${profit >= 0 ? 'session-card__badge--win' : 'session-card__badge--loss'}`}>
                        {profit >= 0 ? 'Win' : 'Loss'}
                      </span>
                    </div>
                    <h3 className='session-card__title'>
                      {session.type === 'tournament' ? session.name : `${session.game} - ${session.blinds}`}
                    </h3>
                    <div className='session-card__info'>
                      <div className='session-card__detail'>
                        <span className='session-card__label'>Venue:</span>
                        <span>{session.venue}</span>
                      </div>
                      <div className='session-card__detail'>
                        <span className='session-card__label'>Result:</span>
                        <span className={profit >= 0 ? 'success' : 'error'}>
                          {formatCurrency(profit)}
                        </span>
                      </div>
                      <div className='session-card__detail'>
                        <span className='session-card__label'>Duration:</span>
                        <span>{formatDuration(session.startTime, session.endTime)}</span>
                      </div>
                    </div>
                    <Link to={`/session/${session._id}`} className='session-card__link'>
                      View Details →
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* No Sessions State */}
        {sessions.length === 0 && (
          <div className='dashboard__empty'>
            <h2 className='heading-lg'>No Sessions Yet</h2>
            <p>Start tracking your poker journey!</p>
            <Link to='/session/new' className='btn'>
              Start New Session
            </Link>
          </div>
        )}

        {/* End Session Modal */}
        {sessionToEnd && (
          <EndSessionModal
            session={sessionToEnd}
            onClose={() => setSessionToEnd(null)}
            onSuccess={handleSessionEnded}
          />
        )}

        {/* Quick Actions Modal */}
        {sessionForQuickAction && (
          <QuickActionsModal
            session={sessionForQuickAction}
            onClose={() => setSessionForQuickAction(null)}
            onSuccess={handleQuickActionUpdate}
          />
        )}
      </div>
    </>
  )
}
export default Dashboard
