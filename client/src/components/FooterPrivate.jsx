import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { FaFileImport, FaXmark } from 'react-icons/fa6'
import { useSession } from '../hooks/useSession'

const FooterPrivate = () => {
  const navigate = useNavigate()
  const { importSessions } = useSession()
  const [showImportModal, setShowImportModal] = useState(false)
  const [importPreview, setImportPreview] = useState([])
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef(null)

  const formatCurrency = amount =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)

  const handleImportFile = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = event => {
      try {
        const lines = event.target.result.trim().split('\n')
        const rows = lines.slice(1).filter(l => l.trim())
        const parsed = rows
          .map(line => {
            const parts = line.split(',')
            return { start: parts[0].trim(), end: parts[1].trim(), profit: parseFloat(parts[2].trim()) }
          })
          .filter(r => !isNaN(r.profit))
        if (parsed.length === 0) {
          toast.error('No valid sessions found in file')
          return
        }
        setImportPreview(parsed)
        setShowImportModal(true)
      } catch {
        toast.error('Failed to parse CSV file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleImportConfirm = async () => {
    setImporting(true)
    const result = await importSessions(importPreview)
    if (result) {
      toast.success(`Imported ${result.count} sessions`)
      setShowImportModal(false)
      setImportPreview([])
      navigate('/dashboard')
    }
    setImporting(false)
  }

  const importTotalPL = importPreview.reduce((s, r) => s + r.profit, 0)

  return (
    <footer className='footer'>
      <span className='footer__copy'>© {new Date().getFullYear()} Poker Tracker</span>

      <input type='file' accept='.csv' ref={fileInputRef} style={{ display: 'none' }} onChange={handleImportFile} />
      <button className='footer__import-btn' onClick={() => fileInputRef.current?.click()} title='Import CSV'>
        <FaFileImport />
        <span>Import</span>
      </button>

      {showImportModal && (
        <div className='new-session-overlay' onClick={() => setShowImportModal(false)}>
          <div className='new-session-modal' onClick={e => e.stopPropagation()}>
            <div className='new-session-modal__header'>
              <h3>Import Sessions</h3>
              <button className='new-session-modal__close' onClick={() => setShowImportModal(false)}>
                <FaXmark />
              </button>
            </div>
            <div className='import-preview'>
              <div className='import-preview__stats'>
                <div className='import-preview__stat'>
                  <span className='import-preview__stat-label'>Sessions Found</span>
                  <span className='import-preview__stat-value'>{importPreview.length}</span>
                </div>
                <div className='import-preview__stat'>
                  <span className='import-preview__stat-label'>Total P/L</span>
                  <span className={`import-preview__stat-value ${importTotalPL >= 0 ? 'success' : 'error'}`}>
                    {importTotalPL >= 0 ? '+' : ''}{formatCurrency(importTotalPL)}
                  </span>
                </div>
              </div>
              <p className='import-preview__note'>Sessions will be imported as cash-type with net profit stored directly.</p>
              <button className='btn btn--primary' onClick={handleImportConfirm} disabled={importing}>
                {importing ? 'Importing...' : `Import ${importPreview.length} Sessions`}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}

export default FooterPrivate
