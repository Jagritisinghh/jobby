import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import {BsSearch, BsBagFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import Cookies from 'js-cookie'

import Header from '../Header'

import NotFound from '../NotFound'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiStatusConstantsProfile = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    userDetails: [],
    jobList: [],
    apiStatus: apiStatusConstants.initial,
    apiStatusProfile: apiStatusConstantsProfile.initial,
    searchInput: '',
    checkBoxInputs: [],
    radioInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    this.setState({
      apiStatusProfile: apiStatusConstantsProfile.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const res = await fetch(apiUrl, options)

    console.log('res', res)

    // console.log(updatedData)
    if (res.ok === true) {
      const data = await res.json()
      const updatedData = {
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
        name: data.profile_details.name,
      }
      this.setState({
        userDetails: updatedData,
        apiStatusProfile: apiStatusConstantsProfile.success,
      })
    } else {
      this.setState({
        apiStatusProfile: apiStatusConstantsProfile.failure,
      })
    }
  }

  dashboard = () => {
    const {userDetails} = this.state
    const {profileImageUrl, name, shortBio} = userDetails
    // console.log(userDetails)
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile" />
        <h1 className="name">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileFailureView = () => (
    <div className="failure-view-container">
      <button
        type="button"
        className="retry-button"
        onClick={this.getProfileDetails} // Add this onClick handler to retry the request
      >
        Retry
      </button>
    </div>
  )

  renderDashboard = () => {
    const {apiStatusProfile} = this.state
    switch (apiStatusProfile) {
      case apiStatusConstantsProfile.inProgress:
        return this.renderLoader()
      case apiStatusConstantsProfile.success:
        return this.dashboard()
      case apiStatusConstantsProfile.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const {checkBoxInputs, radioInput, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkBoxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const res = await fetch(apiUrl, options)
    const data = await res.json()
    const updatedJobDetails = data.jobs.map(job => ({
      companyLogo: job.company_logo_url,
      empType: job.employment_type,
      title: job.title,
      id: job.id,
      location: job.location,
      packagePerAnnum: job.package_per_annum,
      rating: job.rating,
      jobDescription: job.job_description,
    }))

    if (res.ok === true) {
      this.setState({
        jobList: updatedJobDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  JobSearchView = () => {
    const {jobList} = this.state
    // console.log('searchRes', searchResults.length)
    if (jobList.length !== 0) {
      return (
        <ul className="jobResults">
          {jobList.map(each => (
            <Link to={`/jobs/${each.id}`} className="link">
              <li className="detailed-section-container" key={each.id}>
                <div className="header">
                  <img
                    src={each.companyLogo}
                    alt="company logo"
                    className="company-logo"
                  />
                  <div className="title-and-ratings-container">
                    <h1 className="title">{each.title}</h1>
                    <div className="ratings-container">
                      <AiFillStar color=" #fbbf24" size={22} />
                      <p className="rating">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="internship-location-and-lpa">
                  <div className="internship-and-location">
                    <div className="ratings-container">
                      <MdLocationOn color="white" size={20} />
                      <p className="location">{each.location}</p>
                    </div>
                    <div className="ratings-container">
                      <BsBagFill color="white" size={20} />

                      <p className="location">{each.empType}</p>
                    </div>
                  </div>
                  <p className="rating">{each.packagePerAnnum}</p>
                </div>
                <hr className="horizontal-line" />
                <h3 className="description-title">Description</h3>
                <p className="description">{each.jobDescription}</p>
              </li>
            </Link>
          ))}
        </ul>
      )
    }
    return <NotFound />
  }

  renderJobFailureView = () => (
    <div className="job-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-failure-img"
      />
      <h1 className="title">Oops! Something Went Wrong</h1>
      <p className="description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        data-testid="button"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="no-jobs-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png " // Replace with the actual image URL
        alt="no jobs"
        className="no-jobs-img"
      />
      <h1 className="title">No Jobs Found</h1>
      <p className="description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderDetailedView = () => {
    const {apiStatus, jobList} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        if (jobList.length === 0) {
          return this.renderNoJobsView()
        }
        return this.JobSearchView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  // -------Searching-----

  onEnterSearchInput = e => {
    if (e.key === 'Enter') {
      this.getJobDetails()
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  searchInputContainer = () => {
    const {searchInput} = this.state
    return (
      <div className="input-container">
        <input
          placeholder="Search"
          id="username"
          type="search"
          className="input-field-search"
          onChange={this.onChangeSearchInput}
          value={searchInput}
          onKeyDown={this.onEnterSearchInput}
        />
        <button
          type="button"
          data-testid="searchButton"
          className="search-button"
          onClick={this.getJobDetails}
        >
          <BsSearch className="search-icon" size={30} color="#7e858e" />
        </button>
      </div>
    )
  }

  onGetRadioOption = e => {
    this.setState({radioInput: e.target.id}, this.getJobDetails)
  }

  //   onClickSalary = e => {
  //     this.changeSalary(e.target.value)
  //   }

  onGetInputOption = e => {
    const {checkBoxInputs} = this.state
    const inputNotInList = checkBoxInputs.filter(each => each === e.target.id)
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInputs: [...prevState.checkBoxInputs, e.target.id],
        }),
        this.getJobDetails,
      )
    } else {
      const filteredData = checkBoxInputs.filter(each => each !== e.target.id)
      this.setState({checkBoxInputs: filteredData}, this.getJobDetails)
    }
  }

  changeEmployeeType = type => {
    this.setState(
      prev => ({employeeType: [...prev.employeeType, type]}),
      this.getJobDetails,
    )
  }

  //   onSelectEmploymentType = e => {
  //     this.changeEmployeeList(e.target.value)
  //   }

  renderEmploymentAndSalary = () => (
    <div>
      <hr className="horizontal-line" />

      <h1 className="emp-type">Type of Employment</h1>
      <ul className="employment-types">
        {employmentTypesList.map(each => (
          <li
            className="input"
            key={each.employmentTypeId}
            // onChange={this.onSelectEmploymentType}
          >
            <input
              type="checkbox"
              className="checkbox"
              id={each.employmentTypeId}
              value={each.employmentTypeId}
              onChange={this.onGetInputOption}
            />
            <label htmlFor={each.employmentTypeId} className="label">
              {each.label}
            </label>
          </li>
        ))}
      </ul>

      <hr className="horizontal-line" />

      <h1 className="emp-type">Salary Range</h1>

      <ul className="employment-types">
        {salaryRangesList.map(each => (
          <li
            className="input"
            key={each.salaryRangeId}
            // onClick={this.onClickSalary}
          >
            <input
              type="radio"
              className="radio"
              id={each.salaryRangeId}
              name="employment-type"
              onChange={this.onGetRadioOption}
            />
            <label htmlFor={each.salaryRangeId} className="label">
              {each.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="responsive-container">
            <div className="responsive-input-container">
              {this.searchInputContainer()}
            </div>

            <div className="profile-dashboard">
              {this.renderDashboard()}
              {this.renderEmploymentAndSalary()}
            </div>

            <div className="detailed-view">
              <div className="responsive-input-container-lg">
                {this.searchInputContainer()}
              </div>
              {this.renderDetailedView()}
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
