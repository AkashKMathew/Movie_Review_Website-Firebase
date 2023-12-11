import React from 'react'
import "./Home.css"
import { Link } from 'react-router-dom'
const Home = () => {
  
  return (
    <>
    <div className="container">
      <div className='contents'>
        <section className='main-head'>
        <h1>Welcome to Movie Review Hub!</h1>
        </section>
      <p>
        Discover, review, and share your favorite movies with the community.
      </p>
        <h2>Share Your Thoughts</h2>
        <h2>Explore Top Reviews</h2>

        <p>
          Have you recently watched an amazing movie?
          </p>
          <p>Share your thoughts and
          insights with the Movie Review Hub community! Adding a new review is
          quick and easy.
        </p>

        <Link to="/login"><button>Get Started</button></Link>
      </div>
    </div>
    <div className='shadow-overlay'></div>
    </>
  )
}

export default Home