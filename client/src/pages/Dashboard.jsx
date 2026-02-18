import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaXmark, FaCopy } from 'react-icons/fa6'
// Components
import PageTitle from '../components/PageTitle'
import Loader from '../components/Loader'
import TournamentCard from '../components/TournamentCard'
import CashCard from '../components/CashCard'
import CashForm from '../components/forms/CashForm'
import TournamentForm from '../components/forms/TournamentForm'
// Hooks
import { useSession } from '../hooks/useSession'
import { useBankroll } from '../hooks/useBankroll'

const Dashboard = () => {
  const navigate = useNavigate()
  const { getSessions } = useSession()
  const { getTransactions } = useBankroll()
  const [sessions, setSessions] = useState([])
  const [bankrollBalance, setBankrollBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showNewSessionModal, setShowNewSessionModal] = useState(false)
  const [newSessionType, setNewSessionType] = useState('cash')
  const [prefillData, setPrefillData] = useState(null)

  const handleCloseModal = () => {
    setShowNewSessionModal(false)
    setPrefillData(null)
  }

  const handleDuplicate = (e, session) => {
    e.stopPropagation()
    setNewSessionType(session.type)
    setPrefillData(session)
    setShowNewSessionModal(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      const [sessData, txData] = await Promise.all([getSessions(), getTransactions()])
      if (sessData) setSessions(sessData)
      if (txData) {
        const deposited = txData.filter(t => t.type === 'deposit').reduce((s, t) => s + t.amount, 0)
        const withdrawn = txData.filter(t => t.type === 'withdrawal').reduce((s, t) => s + t.amount, 0)
        setBankrollBalance(deposited - withdrawn)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const activeSessions = sessions.filter(s => !s.endTime)
  const completedSessions = sessions.filter(s => s.endTime)

  const calcProfit = (session) => {
    const buyin = parseFloat(session.buyin) || 0
    const expenses = parseFloat(session.expenses) || 0
    const cashout = parseFloat(session.cashout) || 0
    if (session.type === 'cash') {
      return cashout - (buyin + (parseFloat(session.rebuys) || 0) + expenses)
    }
    return cashout + (parseFloat(session.bountiesCollected) || 0) - (buyin + (parseFloat(session.addonsCost) || 0) + expenses)
  }

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(num)
  }

  const formatDuration = (start, end) => {
    const diff = new Date(end) - new Date(start)
    const h = Math.floor(diff / (1000 * 60 * 60))
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${h}h ${m}m`
  }

  const totalProfit = completedSessions.reduce((sum, s) => sum + calcProfit(s), 0)
  const winningSessions = completedSessions.filter(s => calcProfit(s) > 0).length
  const winRate = completedSessions.length > 0
    ? ((winningSessions / completedSessions.length) * 100).toFixed(0)
    : 0
  const avgProfit = completedSessions.length > 0
    ? totalProfit / completedSessions.length
    : 0

  if (loading) return <Loader />

  return (
    <>
      <PageTitle title='Dashboard' />

      {/* Bankroll Hero */}
      {bankrollBalance !== null && completedSessions.length > 0 && (
        <div className='bankroll-hero'>
          <div className='bankroll-hero__main'>
            <span className='bankroll-hero__label'>Bankroll</span>
            <span className={`bankroll-hero__value ${(bankrollBalance + totalProfit) >= 0 ? 'success' : 'error'}`}>
              {formatCurrency(bankrollBalance + totalProfit)}
            </span>
          </div>
          <div className='bankroll-hero__breakdown'>
            <span>Net deposits <strong>{formatCurrency(bankrollBalance)}</strong></span>
            <span>Session P/L <strong className={totalProfit >= 0 ? 'success' : 'error'}>{totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}</strong></span>
          </div>
        </div>
      )}

      {/* Session Stats */}
      {completedSessions.length > 0 && (
        <div className='stats-row'>
          <div className='stat-box'>
            <span className='stat-box__label'>Total P/L</span>
            <span className={`stat-box__value ${totalProfit >= 0 ? 'success' : 'error'}`}>
              {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
            </span>
          </div>
          <div className='stat-box'>
            <span className='stat-box__label'>Sessions</span>
            <span className='stat-box__value'>{completedSessions.length}</span>
          </div>
          <div className='stat-box'>
            <span className='stat-box__label'>Win Rate</span>
            <span className='stat-box__value'>{winRate}%</span>
          </div>
          <div className='stat-box'>
            <span className='stat-box__label'>Avg / Session</span>
            <span className={`stat-box__value ${avgProfit >= 0 ? 'success' : 'error'}`}>
              {avgProfit >= 0 ? '+' : ''}{formatCurrency(avgProfit)}
            </span>
          </div>
        </div>
      )}

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div className='dashboard__section'>
          <h2>Active Sessions</h2>
          {activeSessions.map(session => {
            const onUpdate = updated => setSessions(prev => prev.map(s => s._id === updated._id ? updated : s))
            return session.type === 'cash'
              ? <CashCard key={session._id} session={session} onUpdate={onUpdate} />
              : <TournamentCard key={session._id} session={session} onUpdate={onUpdate} />
          })}
        </div>
      )}

      {/* Completed Sessions */}
      {completedSessions.length > 0 && (
        <div className='dashboard__section'>
          <h2>Session History</h2>
          <div className='session-history'>
            {completedSessions.map(session => {
              const profit = calcProfit(session)
              const isProfit = profit >= 0
              const title = session.type === 'cash'
                ? `${session.game} — ${session.blinds}`
                : session.name
              return (
                <div key={session._id} className='session-history__row' onClick={() => navigate(`/session/${session._id}`)}>
                  <span className={`session-history__badge session-history__badge--${session.type}`}>
                    {session.type}
                  </span>
                  <div className='session-history__info'>
                    <span className='session-history__title'>{title}</span>
                    <span className='session-history__meta'>
                      {new Date(session.startTime).toLocaleDateString()} · {formatDuration(session.startTime, session.endTime)}
                    </span>
                  </div>
                  <span className={`session-history__result ${isProfit ? 'success' : 'error'}`}>
                    {isProfit ? '+' : ''}{formatCurrency(profit)}
                  </span>
                  <button
                    className='session-history__dupe-btn'
                    onClick={e => handleDuplicate(e, session)}
                    title='Duplicate session'>
                    <FaCopy />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {sessions.length === 0 && (
        <p>No sessions yet. Start tracking your poker journey!</p>
      )}

      {/* New Session FAB */}
      <button className='fab' onClick={() => setShowNewSessionModal(true)} title='New Session'>
        <FaPlus />
      </button>

      {/* New Session Modal */}
      {showNewSessionModal && (
        <div className='new-session-overlay' onClick={handleCloseModal}>
          <div className='new-session-modal' onClick={e => e.stopPropagation()}>
            <div className='new-session-modal__header'>
              <h3>{prefillData ? 'Duplicate Session' : 'New Session'}</h3>
              <button className='new-session-modal__close' onClick={handleCloseModal}>
                <FaXmark />
              </button>
            </div>

            <div className='session-type-tabs'>
              <button
                className={`session-type-tab${newSessionType === 'cash' ? ' session-type-tab--active' : ''}`}
                onClick={() => setNewSessionType('cash')}>
                Cash Game
              </button>
              <button
                className={`session-type-tab${newSessionType === 'tournament' ? ' session-type-tab--active' : ''}`}
                onClick={() => setNewSessionType('tournament')}>
                Tournament
              </button>
            </div>

            {newSessionType === 'cash' && (
              <CashForm
                buttonText='Start Session'
                prefillData={prefillData?.type === 'cash' ? prefillData : null}
                onSubmitCallback={session => {
                  if (session) setSessions(prev => [...prev, session])
                  handleCloseModal()
                }}
              />
            )}
            {newSessionType === 'tournament' && (
              <TournamentForm
                buttonText='Start Session'
                prefillData={prefillData?.type === 'tournament' ? prefillData : null}
                onSubmitCallback={session => {
                  if (session) setSessions(prev => [...prev, session])
                  handleCloseModal()
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Dashboard
