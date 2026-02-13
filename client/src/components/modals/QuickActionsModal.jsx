import { useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from '../../hooks/useSession'

const QuickActionsModal = ({ session, onClose, onSuccess }) => {
  const { updateSession } = useSession()

  // State for the form fields
  const [rebuys, setRebuys] = useState(session.rebuys || 0)
  const [bountiesCollected, setBountiesCollected] = useState(session.bountiesCollected || 0)
  const [addonsCost, setAddonsCost] = useState(session.addonsCost || 0)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Build the update payload
    const updateData = {
      id: session._id,
      ...session, // Include all existing session data
    }

    // Update based on session type
    if (session.type === 'cash') {
      updateData.rebuys = parseFloat(rebuys) || 0
    } else if (session.type === 'tournament') {
      if (session.bounties) {
        updateData.bountiesCollected = parseInt(bountiesCollected) || 0
      }
      if (session.addons) {
        updateData.addonsCost = parseFloat(addonsCost) || 0
      }
    }

    const result = await updateSession(updateData)

    if (result) {
      toast.success('Session updated successfully!')
      onSuccess(result)
      onClose()
    } else {
      toast.error('Failed to update session')
    }

    setSubmitting(false)
  }

  // Determine if we have any fields to show
  const isCash = session.type === 'cash'
  const hasBounties = session.type === 'tournament' && session.bounties
  const hasAddons = session.type === 'tournament' && session.addons
  const hasFields = isCash || hasBounties || hasAddons

  if (!hasFields) {
    return null
  }

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <h2 className='heading-lg' style={{ color: 'var(--light)' }}>Quick Actions</h2>
        <p className='modal__subtitle'>
          {session.type === 'tournament' ? session.name : `${session.game} - ${session.blinds}`}
        </p>

        <form onSubmit={handleSubmit}>
          <div className='form__section'>
            {/* Cash Game: Rebuys */}
            {isCash && (
              <div className='form__field'>
                <label htmlFor='rebuys'>Total Rebuys ($)</label>
                <input
                  type='number'
                  name='rebuys'
                  id='rebuys'
                  value={rebuys}
                  onChange={(e) => setRebuys(e.target.value)}
                  placeholder='0.00'
                  step='0.01'
                  min='0'
                  autoFocus
                />
                <small style={{ color: 'var(--light)', opacity: 0.7, fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  Current: ${parseFloat(session.rebuys || 0).toFixed(2)}
                </small>
              </div>
            )}

            {/* Tournament: Bounties */}
            {hasBounties && (
              <div className='form__field'>
                <label htmlFor='bountiesCollected'>Bounties Collected</label>
                <input
                  type='number'
                  name='bountiesCollected'
                  id='bountiesCollected'
                  value={bountiesCollected}
                  onChange={(e) => setBountiesCollected(e.target.value)}
                  placeholder='0'
                  min='0'
                  autoFocus={!isCash}
                />
                <small style={{ color: 'var(--light)', opacity: 0.7, fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  Current: {session.bountiesCollected || 0}
                </small>
              </div>
            )}

            {/* Tournament: Addons */}
            {hasAddons && (
              <div className='form__field'>
                <label htmlFor='addonsCost'>Add-ons Cost ($)</label>
                <input
                  type='number'
                  name='addonsCost'
                  id='addonsCost'
                  value={addonsCost}
                  onChange={(e) => setAddonsCost(e.target.value)}
                  placeholder='0.00'
                  step='0.01'
                  min='0'
                  autoFocus={!isCash && !hasBounties}
                />
                <small style={{ color: 'var(--light)', opacity: 0.7, fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  Current: ${parseFloat(session.addonsCost || 0).toFixed(2)}
                </small>
              </div>
            )}
          </div>

          <div className='modal__actions'>
            <button
              type='submit'
              className='btn'
              disabled={submitting}>
              {submitting ? 'Updating...' : 'Update'}
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

export default QuickActionsModal
