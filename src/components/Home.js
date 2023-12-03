import React from 'react'
import "./Home.css"
import { Link } from 'react-router-dom';
function Home() {
  return (
    <div className="container">
      <div className="navbar">
        <h1>Welcome to Movie Review Hub!</h1>
        <Link to="/login"><button className="login-btn">LogIn/SignUp</button></Link>
      </div>
      <p>
        Discover, review, and share your favorite movies with the community.
      </p>

      <section>
        <h2>Share Your Thoughts</h2>
        <p>
          Have you recently watched an amazing movie? Share your thoughts and
          insights with the Movie Review Hub community! Adding a new review is
          quick and easy.
        </p>

        <ul>
          <li>
            <strong>Rate:</strong> Assign a star rating to reflect your overall
            satisfaction.
          </li>
          <li>
            <strong>Review:</strong> Write a detailed review to express your
            thoughts on the storyline, performances, and more.
          </li>
          <li>
            <strong>Upload:</strong> Include an optional movie brochure or
            poster to enhance your review.
          </li>
        </ul>

        <button>Get Started</button>
      </section>

      <section>
        <h2>Explore Top Reviews</h2>
        <p>
          Discover what other movie enthusiasts are saying about the latest
          releases or timeless classics. Browse through our curated list of top
          reviews and find your next movie night pick.
        </p>

        <button>Explore Reviews</button>
      </section>

      <section>
        <h2>Join the Community</h2>
        <p>
          Become a part of our growing community of movie lovers! Connect with
          fellow users, discuss your favorite films, and stay updated on the
          latest movie releases and reviews.
        </p>

        <button>Join Now</button>
      </section>
    </div>
  )
}

export default Home