import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const HomePage = () => (
  <>
    <Header />

    <div className="home-page-main-container">
      <div className="jobby-home-page">
        <h1 className="homepage-heading">Find The Job That Fits Your Life</h1>
        <p className="home-description">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>

        <Link to="/jobs">
          <button className="jobs-btn" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </>
)

export default HomePage
