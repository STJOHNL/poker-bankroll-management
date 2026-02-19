import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FaPlus, FaXmark, FaTrash } from 'react-icons/fa6'
import { useBankroll } from '../hooks/useBankroll'
import { useSession } from '../hooks/useSession'
import PageTitle from '../components/PageTitle'
import Loader from '../components/Loader'

const calcProfit = session => {
  const buyin = parseFloat(session.buyin) || 0
  const expenses = parseFloat(session.expenses) || 0
  const cashout = parseFloat(session.cashout) || 0
  if (session.type === 'cash') {
    return cashout - (buyin + (parseFloat(session.rebuys) || 0) + expenses)
  }
  return cashout + (parseFloat(session.bountiesCollected) || 0) - (buyin + (parseFloat(session.addonsCost) || 0) + expenses)
}

const Bankroll = () => {
  const { getTransactions, createTransaction, deleteTransaction } = useBankroll()
  const { getSessions } = useSession()
  const location = useLocation()

  const [transactions, setTransactions] = useState([])
  const [sessionPL, setSessionPL] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Form state
  const [type, setType] = useState('deposit')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16))
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const [txData, sessData] = await Promise.all([getTransactions(), getSessions()])
      if (txData) setTransactions(txData)
      if (sessData) {
        const completed = sessData.filter(s => s.endTime)
        setSessionPL(completed.reduce((sum, s) => sum + calcProfit(s), 0))
      }
      setLoading(false)
    }
    fetchData()
  }, [location.key]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async e => {
    e.preventDefault()
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return

    setSubmitting(true)
    const result = await createTransaction({ type, amount: parseFloat(amount), note, date })
    if (result) {
      setTransactions(prev => [result, ...prev])
      setAmount('')
      setNote('')
      setDate(new Date().toISOString().slice(0, 16))
      setType('deposit')
      setShowModal(false)
    }
    setSubmitting(false)
  }

  const handleDelete = async id => {
    const deleted = await deleteTransaction(id)
    if (deleted) {
      setTransactions(prev => prev.filter(t => t._id !== id))
    }
  }

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const totalDeposited = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalWithdrawn = transactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0)

  const netDeposits = totalDeposited - totalWithdrawn
  const balance = netDeposits + sessionPL

  if (loading) return <Loader />

  return (
    <>
      <PageTitle title='Bankroll' />

      <div className='stats-row'>
        <div className='stat-box'>
          <span className='stat-box__label'>Bankroll</span>
          <span className={`stat-box__value ${balance >= 0 ? 'success' : 'error'}`}>
            {formatCurrency(balance)}
          </span>
        </div>
        <div className='stat-box'>
          <span className='stat-box__label'>Deposited</span>
          <span className='stat-box__value success'>{formatCurrency(totalDeposited)}</span>
        </div>
        <div className='stat-box'>
          <span className='stat-box__label'>Withdrawn</span>
          <span className='stat-box__value error'>{formatCurrency(totalWithdrawn)}</span>
        </div>
        <div className='stat-box'>
          <span className='stat-box__label'>Session P/L</span>
          <span className={`stat-box__value ${sessionPL >= 0 ? 'success' : 'error'}`}>
            {sessionPL >= 0 ? '+' : ''}{formatCurrency(sessionPL)}
          </span>
        </div>
      </div>

      {transactions.length > 0 ? (
        <div className='dashboard__section'>
          <h2>Transaction History</h2>
          <div className='transaction-list'>
            {transactions.map(t => (
              <div key={t._id} className='transaction-row'>
                <span className={`transaction-row__badge transaction-row__badge--${t.type}`}>
                  {t.type}
                </span>
                <div className='transaction-row__info'>
                  <span className='transaction-row__note'>{t.note || '—'}</span>
                  <span className='transaction-row__date'>
                    {new Date(t.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <span className={`transaction-row__amount ${t.type === 'deposit' ? 'success' : 'error'}`}>
                  {t.type === 'deposit' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
                <button
                  className='transaction-row__delete'
                  onClick={() => handleDelete(t._id)}
                  title='Delete transaction'>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No transactions yet. Log a deposit to get started.</p>
      )}

      <button className='fab' onClick={() => setShowModal(true)} title='Log Transaction'>
        <FaPlus />
      </button>

      {showModal && (
        <div className='new-session-overlay' onClick={() => setShowModal(false)}>
          <div className='new-session-modal' onClick={e => e.stopPropagation()}>
            <div className='new-session-modal__header'>
              <h3>Log Transaction</h3>
              <button className='new-session-modal__close' onClick={() => setShowModal(false)}>
                <FaXmark />
              </button>
            </div>

            <form className='form' onSubmit={handleSubmit}>
              <div className='form__section'>
                <div className='form__field'>
                  <label>Type</label>
                  <select value={type} onChange={e => setType(e.target.value)}>
                    <option value='deposit'>Deposit</option>
                    <option value='withdrawal'>Withdrawal</option>
                  </select>
                </div>
                <div className='form__field'>
                  <label>Amount ($)</label>
                  <input
                    type='number'
                    min='0.01'
                    step='0.01'
                    placeholder='0'
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className='form__field'>
                  <label>Note (optional)</label>
                  <input
                    type='text'
                    placeholder='e.g. Weekly deposit'
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </div>
                <div className='form__field'>
                  <label>Date</label>
                  <input
                    type='datetime-local'
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>
              </div>
              <button type='submit' className='btn btn--primary' disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Bankroll
