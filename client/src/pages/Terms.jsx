import PageTitle from '../components/PageTitle'

const Terms = () => {
  return (
    <>
      <PageTitle title='Terms of Service' />
      <div className='policy'>
        <p className='policy__updated'>Last updated: January 2025</p>
        <div className='policy__section'>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using Poker Tracker, you accept and agree to be bound by these Terms of Service and our Privacy Policy.</p>
        </div>
        <div className='policy__section'>
          <h2>2. Use of Service</h2>
          <p>Poker Tracker is intended for personal bankroll tracking purposes. You agree to use the service responsibly and in compliance with all applicable laws and regulations.</p>
        </div>
        <div className='policy__section'>
          <h2>3. Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately of any unauthorized use.</p>
        </div>
        <div className='policy__section'>
          <h2>4. Data & Privacy</h2>
          <p>Your use of Poker Tracker is also governed by our Privacy Policy, which is incorporated into these terms by reference. We take your data seriously and handle it with care.</p>
        </div>
        <div className='policy__section'>
          <h2>5. Limitation of Liability</h2>
          <p>Poker Tracker is provided "as is" without warranties of any kind. We are not liable for any losses or damages arising from your use of the service.</p>
        </div>
        <div className='policy__section'>
          <h2>6. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes your acceptance of the updated terms.</p>
        </div>
      </div>
    </>
  )
}

export default Terms
