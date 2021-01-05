import React, { Component } from 'react'
import {
  Link,
  withRouter
} from 'react-router-dom'
import styles from './Home.module.css'

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() { }

  render() {

    return (
      <div className={`${styles.container} animateFadeIn`}>
        <div className={styles.containerInner}>

          { /* Hero Artwork */}

          <div className={`${styles.heroTitle} animateFlicker`}>
            PANGRAM
          </div>

          { /* Hero Description */}

          <div className={`${styles.heroDescription}`}>
            A fun word game
          </div>

          { /* Call To Action */}

          <div className={`${styles.containerCta}`}>

            <Link to='/register'>
              <button className={`buttonPrimaryLarge`}>
                Register
              </button>
            </Link>

            <Link to='/login' className={`${styles.linkSignIn}`}>sign-in</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Home)