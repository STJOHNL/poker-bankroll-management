import { Link } from 'react-router-dom'
// Components
import PageTitle from '../components/PageTitle'

const PrivacyPolicy = () => {
  return (
    <>
      <PageTitle title='Privacy Policy' />
      <div className='policy'>
        <p className='policy__updated'>Last updated: January 2025</p>
        <div className='policy__section'>
          <h2>What We Collect</h2>
          <ul>
            <li>Basic info you provide (name, email)</li>
            <li>Session data you log (buy-ins, cashouts, venues, notes)</li>
            <li>Usage data (pages visited, time spent)</li>
            <li>Technical data (IP address, browser type)</li>
          </ul>
        </div>
        <div className='policy__section'>
          <h2>How We Use It</h2>
          <ul>
            <li>To provide and improve the Poker Tracker service</li>
            <li>To keep you informed about updates and changes</li>
            <li>To comply with legal obligations</li>
          </ul>
        </div>
        <div className='policy__section'>
          <h2>Keeping Your Info Safe</h2>
          <p>We use industry-standard security measures to protect your data. Your session data is private to your account and is never shared with other users.</p>
        </div>
        <div className='policy__section'>
          <h2>Sharing</h2>
          <p>We do not sell your personal information. We may share anonymized, aggregate data for analytics purposes but never anything that identifies you individually.</p>
        </div>
        <div className='policy__section'>
          <h2>Your Rights</h2>
          <p>You can request to view, update, or delete your personal data at any time by contacting us at <Link to='mailto:logan@devtivity.com'>logan@devtivity.com</Link>.</p>
        </div>
        <div className='policy__section'>
          <h2>Cookies</h2>
          <p>We use cookies to maintain your session and understand how users interact with the app. No third-party advertising cookies are used.</p>
        </div>
      </div>
    </>
  )
}

export default PrivacyPolicy
