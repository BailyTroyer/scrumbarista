import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import Slack1 from "../../assets/slack1.svg"
import Slack2 from "../../assets/slack2.svg"
import AddToSlack from "../../assets/addToSlack.svg"
import FloatingLady from "../../assets/floatingLady.svg"
import Wave from "../../assets/wave.svg"

import LHSScreenShot from "../../assets/lhsScreenShot.svg"
import RHSScreenShot from "../../assets/rhsScreenShot.svg"

import "../styles/index.scss"

const IndexPage = () => (
  <Layout>
    <div className="main-container">
      <div className="hero-container">
        <h2 className="hero-title"><span style={{color: '#36C5EF'}}>Managing</span> your <span style={{color: '#2EB57C'}}>Stand-up</span> <span style={{color: '#ECB22E'}}>shouldn't</span> be this <span style={{color: '#E01D5A'}}>hard</span>. Leave it to ScrumBarista!</h2>
        <AddToSlack style={{width: '280px', height: '50px'}} />
        <h3 className="hero-subtitle"><span style={{fontWeight: 'bold'}}>Free.</span> Always</h3>
      </div>

      <Wave style={{
        zIndex: -99,
        marginTop: '-10px',
      }} />


      <div className="slack-image-container">
        <Slack1 style={{width: '700px'}} />
        <Slack2 style={{width: '460px'}} />
      </div>

      <div className="overview-container">
        <div className="overview-text-container">
          <h2 style={{fontSize: 42, color: '#3D3E40'}}>ScrumBarista makes everything simpler!</h2>
          <div>
            <h4 style={{fontSize: 28, color: '#393A3D'}}>Keep your team in sync</h4>
            <p style={{fontSize: 24, color: '#57585A', fontWeight: '500', maxWidth: '600px'}}>Find harmony in your day as standups, scrums, retrospectives, and surveys run on autopilot.</p>

            <h4 style={{fontSize: 28, color: '#393A3D'}}>Save time, less Zoom meetings</h4>
            <p style={{fontSize: 24, color: '#57585A', fontWeight: '500', maxWidth: '500px'}}>No more time consuming stand-up meetings that always go off-topic.</p>

            <h4 style={{fontSize: 28, color: '#393A3D'}}>Easily export & aggregate</h4>
            <p style={{fontSize: 24, color: '#57585A', fontWeight: '500', maxWidth: '500px'}}>No more hunting down and memorizing what you’ve done all quarter. Easily export and save come review season!</p>

            <h4 style={{fontSize: 28, color: '#393A3D'}}>Made for Slack</h4>
            <p style={{fontSize: 24, color: '#57585A', fontWeight: '500', maxWidth: '600px'}}>Move key activities to your favorite Slack channel as ScrumBarista works straight out-the-box.</p>
          </div>
        </div>
        <div>
          <FloatingLady />
        </div>
      </div>


      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#3D7BD9',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',

        paddingTop: '4em',
        paddingBottom: '4em',

      }}>

        <h2 style={{
          fontSize: 52,
          fontWeight: '800',
          color: 'white',
        }}>How Scrumbarista Works</h2>

        <div style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}>

          <LHSScreenShot />

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <h3 style={{
              fontSize: 48,
              fontWeight: '800',
              color: 'white',
            }}>Manage</h3>
            <p style={{
              fontSize: 34,
              fontWeight: '500',
              lineHeight: '150%',
              color: 'white',
              maxWidth: '700px',
              textAlign: 'center',
            }}>With one easy command, you manage standups on a per-channel basis. As users join/leave they get added automatically</p>
          </div>


        </div>

        <div style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
        }}>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <h3 style={{
              fontSize: 48,
              fontWeight: '800',
              color: 'white',
            }}>Partake</h3>
            <p style={{
              fontSize: 34,
              fontWeight: '500',
              lineHeight: '150%',
              color: 'white',
              maxWidth: '700px',
              textAlign: 'center',
            }}>You checkin on your own time with one command, or you can respond to ScrumBarista’s defined questions.</p>
          </div>

          <RHSScreenShot />
        </div>

      </div>


      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        backgroundColor: '#FAFAFA',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',

        paddingTop: '4em',
        paddingBottom: '4em',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <h2 style={{
            color: '#3D3E40',
            fontWeight: '800',
            fontSize: '48'
          }}>Feedback</h2>
          <p style={{
            color: '#3D3E40',
            fontWeight: '600',
            fontSize: 24,
            maxWidth: '700px',
            lineHeight: '40px',
            textAlign: 'center'
          }}>We’ll take any feedback we can get! Happy, mad or have a feature request? </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>

        <h2 style={{
          color: '#3D3E40',
          fontWeight: '800',
          fontSize: '48'
        }}>Contributing</h2>

        <p style={{
          color: '#3D3E40',
          fontWeight: '600',
          fontSize: 24,
          maxWidth: '700px',
          lineHeight: '40px',
          textAlign: 'center'
        }}>Are you impatient and see a bug or feature you want added in?</p>

        </div>

      </div>


      <div style={{
        paddingTop: '4em',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <h2 style={{
          fontSize: 48,
          fontWeight: '800',
          color: '#3D3E40',
        }}>Contact Us</h2>

      </div>
    </div>
  </Layout>
)


export default IndexPage
