import { Link } from 'react-router-dom'
import { FaCoins, FaArrowTrendUp, FaClockRotateLeft, FaShieldHalved } from 'react-icons/fa6'
import PageTitle from '../components/PageTitle'

const Home = () => {
  return (
    <>
      <PageTitle title='Poker Tracker' hideTitle />

      <section className='hero'>
        <FaCoins className='hero__icon' />
        <h1 className='hero__title'>Poker Tracker</h1>
        <p className='hero__subtitle'>
          Track your sessions. Analyze your edge. Play your best game.
        </p>
        <div className='hero__cta'>
          <Link to='/sign-up' className='btn btn--primary'>Get Started</Link>
          <Link to='/sign-in' className='btn btn--ghost'>Sign In</Link>
        </div>
      </section>

      <section className='features'>
        <div className='feature-card'>
          <FaClockRotateLeft className='feature-card__icon' />
          <h3>Session Tracking</h3>
          <p>Log every cash game and tournament. Track buy-ins, cashouts, rebuys, and expenses in real time.</p>
        </div>
        <div className='feature-card'>
          <FaArrowTrendUp className='feature-card__icon' />
          <h3>Bankroll Analytics</h3>
          <p>See your win rate, profit trends, and average session performance at a glance.</p>
        </div>
        <div className='feature-card'>
          <FaShieldHalved className='feature-card__icon' />
          <h3>Game Selection</h3>
          <p>Make data-driven decisions about stakes and venues based on your session history.</p>
        </div>
      </section>
    </>
  )
}

export default Home
