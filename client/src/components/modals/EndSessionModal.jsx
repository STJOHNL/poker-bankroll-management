import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from '../../hooks/useSession'

const EndSessionModal = ({ session, onClose, onSuccess }) => {
  const { updateSession } = useSession()

  // State for the form fields
  const [cashout, setCashout] = useState('')
  const [totalPlayers, setTotalPlayers] = useState('')
  const [finishPosition, setFinishPosition] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Build the update payload
    const updateData = {
      id: session._id,
      ...session, // Include all existing session data
      cashout: parseFloat(cashout) || 0,
      endTime: new Date().toISOString()
    }

    // Add tournament-specific fields
    if (session.type === 'tournament') {
      updateData.totalPlayers = parseInt(totalPlayers) || 0
      updateData.finishPosition = parseInt(finishPosition) || 0
    }

    const result = await updateSession(updateData)

    if (result) {
      toast.success('Session ended successfully!')
      onSuccess(result)
      onClose()
    } else {
      toast.error('Failed to end session')
    }

    setSubmitting(false)
  }

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <h2 className='heading-lg' style={{ color: 'var(--light)' }}>End Session</h2>
        <p className='modal__subtitle'>
          {session.type === 'tournament' ? session.name : `${session.game} - ${session.blinds}`}
        </p>

        <form onSubmit={handleSubmit}>
          <div className='form__section'>
            <div className='form__field'>
              <label htmlFor='cashout'>Cash Out Amount ($) *</label>
              <input
                type='number'
                name='cashout'
                id='cashout'
                value={cashout}
                onChange={(e) => setCashout(e.target.value)}
                placeholder='0.00'
                step='0.01'
                min='0'
                autoFocus
                required
              />
            </div>

            {session.type === 'tournament' && (
              <>
                <div className='form__field'>
                  <label htmlFor='totalPlayers'>Total Players *</label>
                  <input
                    type='number'
                    name='totalPlayers'
                    id='totalPlayers'
                    value={totalPlayers}
                    onChange={(e) => setTotalPlayers(e.target.value)}
                    placeholder='0'
                    min='1'
                    required
                  />
                </div>

                <div className='form__field'>
                  <label htmlFor='finishPosition'>Finish Position *</label>
                  <input
                    type='number'
                    name='finishPosition'
                    id='finishPosition'
                    value={finishPosition}
                    onChange={(e) => setFinishPosition(e.target.value)}
                    placeholder='0'
                    min='1'
                    required
                  />
                </div>
              </>
            )}
          </div>

          <div className='modal__actions'>
            <button
              type='submit'
              className='btn'
              disabled={submitting}>
              {submitting ? 'Ending...' : 'End Session'}
            </button>
            <button
              type='button'
              className='btn btn--secondary'
              onClick={onClose}
              disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EndSessionModal
