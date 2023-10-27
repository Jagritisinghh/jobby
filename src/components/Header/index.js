import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {GiShoppingBag} from 'react-icons/gi'

import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')

    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <Link className="link" to="/">
        <img
          className="logo"
          alt="website logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
        />
      </Link>
      <ul className="nav-items-container">
        <Link to="/">
          <AiFillHome color="white" size={25} className="icon" />
        </Link>
        <Link to="/jobs">
          <GiShoppingBag color="white" size={25} className="icon" />
        </Link>
        <button className="logout-btn" type="button" onClick={onLogout}>
          <FiLogOut color="white" size={25} className="icon" />
        </button>
      </ul>

      <ul className="links">
        <div className="home-job">
          <Link to="/" className="link nav-head">
            <li>Home</li>
          </Link>
          <Link to="/jobs" className="link nav-head">
            <li>Jobs</li>
          </Link>
        </div>
        <li>
          <button type="button" className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)
