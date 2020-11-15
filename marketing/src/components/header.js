import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import Bars from "../../assets/bars.svg"

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `#444E73`,
      paddingBottom: `1.45rem`,
      display: 'flex',
      flex: 1,
      // paddingLeft: '10em',
      // paddingRight: '10em',
    }}
  >
    <div
      style={{
        padding: `2rem`,
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <h2 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {`${siteTitle} ☕`}
        </Link>
      </h2>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          flex: 1,
          borderStyle: 'solid',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '5px',
          height: '40px',
          width: '50px',
          borderWidth: '2px',
          borderColor: 'white',
        }}><Bars style={{width: '20px', height: '20px', color: 'white'}} /></div>
      </div>
    </div>
  </header>
)

// <h2 style={{color: 'white', margin: 0, fontSize: 18, fontWeight: '600', opacity: 0.8}}>Home</h2>
//         <h2 style={{color: 'white', margin: 0, paddingLeft: '2em', fontSize: 18, fontWeight: '600', opacity: 0.8}}>About</h2>
//         <h2 style={{color: 'white', margin: 0, paddingLeft: '2em', fontSize: 18, fontWeight: '600', opacity: 0.8}}>Feedback</h2>
//         <h2 style={{color: 'white', margin: 0, padding: '0em 2em', fontSize: 18, fontWeight: '600', opacity: 0.8}}>Contribute</h2>

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
