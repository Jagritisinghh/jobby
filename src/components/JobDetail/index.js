import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsBagFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobDetail extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetailsList: [],
    similarJobList: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params
    // console.log(id)

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const res = await fetch(apiUrl, options)

    // console.log(updatedData)

    if (res.ok === true) {
      const data = await res.json()
      console.log(data)
      const updatedData = {
        companyLogoUrl: data.job_details.company_logo_url,
        employmentType: data.job_details.employment_type,
        companyWebsiteUrl: data.job_details.company_website_url,
        jobDescription: data.job_details.job_description,
        id: data.job_details.id,
        lifeAtCompanyDescription: data.job_details.life_at_company.description,
        lifeAtCompanyImageUrl: data.job_details.life_at_company.image_url,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        skills: data.job_details.skills.map(eachSkill => ({
          name: eachSkill.name,
          imageUrl: eachSkill.image_url,
        })),

        title: data.job_details.title,
      }
      const similarJobsUpdatedList = data.similar_jobs.map(jobs => ({
        companyLogoUrl: jobs.company_logo_url,
        employmentType: jobs.employment_type,
        companyWebsiteType: jobs.company_website_url,
        jobDescription: jobs.job_description,
        id: jobs.id,
        location: jobs.location,
        rating: jobs.rating,
        title: jobs.title,
      }))

      this.setState({
        jobDetailsList: updatedData,
        similarJobList: similarJobsUpdatedList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetailsSection = () => {
    const {jobDetailsList} = this.state
    return (
      <div className="detailed-section-container">
        <div className="header">
          <img
            src={jobDetailsList.companyLogoUrl}
            alt="job details company logo"
            className="company-logo"
          />
          <div className="title-and-ratings-container">
            <h1 className="title">{jobDetailsList.title}</h1>
            <div className="ratings-container">
              <AiFillStar color=" #fbbf24" size={22} />
              <p className="rating">{jobDetailsList.rating}</p>
            </div>
          </div>
        </div>
        <div className="internship-location-and-lpa">
          <div className="internship-and-location">
            <div className="ratings-container">
              <MdLocationOn color="white" size={20} />
              <p className="location">{jobDetailsList.location}</p>
            </div>
            <div className="ratings-container">
              <BsBagFill color="white" size={20} />

              <p className="location">{jobDetailsList.employmentType}</p>
            </div>
          </div>
          <p className="rating">{jobDetailsList.packagePerAnnum}</p>
        </div>
        <hr className="horizontal-line" />
        <div className="description-and-visit-link">
          <h3 className="description-title">Description</h3>

          <a href={jobDetailsList.companyWebsiteUrl} className="visit-link">
            Visit <BiLinkExternal />
          </a>
        </div>
        <p className="description">{jobDetailsList.jobDescription}</p>
        <h1 className="skills-heading">Skills</h1>
        <ul className="skills-container">
          {jobDetailsList.skills.map(eachSkill => (
            <li key={eachSkill.name} className="skills-items">
              <img
                src={eachSkill.imageUrl}
                alt={eachSkill.name}
                className="skill-image"
              />
              <p className="skill-name">{eachSkill.name}</p>
            </li>
          ))}
        </ul>

        <h1 className="life-at-company-heading">Life at Company</h1>
        <div className="life-at-company-container">
          <p className="description">
            {jobDetailsList.lifeAtCompanyDescription}
          </p>
          <img
            src={jobDetailsList.lifeAtCompanyImageUrl}
            alt="life at company"
            className="life-at-company-image"
          />
        </div>
      </div>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobList} = this.state
    console.log('similar', similarJobList)
    return (
      <>
        <h1 className="similar-jobs-head"> Similar Jobs</h1>

        <ul>
          {similarJobList.map(each => (
            <li className="detailed-section-container" key={each.id}>
              <div className="header">
                <img
                  src={each.companyLogoUrl}
                  alt="similar job company logo"
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

                    <p className="location">{each.employmentType}</p>
                  </div>
                </div>
                <p className="rating">{each.packagePerAnnum}</p>
              </div>
              {/* <hr className="horizontal-line" /> */}
              <h3 className="description-title">Description</h3>

              <a href={each.companyWebsiteType}>Visit</a>
              <p className="description">{each.jobDescription}</p>
            </li>
          ))}
        </ul>
      </>
    )
  }

  clickRetry = () => {
    this.getJobDetails()
  }

  renderJobFailureView = () => (
    <div className="job-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-failure-img"
      />
      <h1 className="description-title">Oops! Something Went Wrong</h1>
      <p className="description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-button" onClick={this.clickRetry}>
        Retry
      </button>
    </div>
  )

  renderDashboard = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderJobDetailsSection()
      case apiStatusConstants.failure:
        return this.renderJobFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="responsive-job-container">
            {this.renderDashboard()}
            {this.renderSimilarJobs()}
          </div>
        </div>
      </>
    )
  }
}

export default JobDetail
