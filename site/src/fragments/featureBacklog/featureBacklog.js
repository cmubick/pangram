import React, { Component } from 'react'
import styles from './featureBacklog.module.css'

export default class FeatureBacklog extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {}

  render() {
    return (
      <div className={`${this.props.className}`}>
        <div className={`${styles.container}`}>
          <div>
            <button onClick={this.props.onClose}>X</button>
          </div>
          <div className={styles.title}>
            Upcoming Features
          </div>
          <div className={styles.heading}>
            Games
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>Play without loging in</li>
            <li className={styles.listItem}>Timed games</li>
            <li className={styles.listItem}>Link games to a user</li>
            <li className={styles.listItem}>History of games</li>
            <li className={styles.listItem}>Match Games</li>
          </ul>

          <div className={styles.heading}>
            Profile
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>Add usernames</li>
            <li className={styles.listItem}>Add Avatar</li>
            <li className={styles.listItem}>Add Bio</li>
          </ul>

          <div className={styles.heading}>
            Sound
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>Add sound effects</li>
            <li className={styles.listItem}>Add music</li>
            <li className={styles.listItem}>Add volume options</li>
          </ul>

          <div className={styles.heading}>
            Messaging
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>Add direct messaging</li>
            <li className={styles.listItem}>Add in game messaging</li>
            <li className={styles.listItem}>Add message boards</li>
          </ul>

          <div className={styles.heading}>
            Dictionary
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>Display word definitions</li>
            <li className={styles.listItem}>Link to external definitions</li>
          </ul>

          <div className={styles.heading}>
            Authorization
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>Add reset password option</li>
            <li className={styles.listItem}>Link to social media accounts</li>
          </ul>

          <div className={styles.heading}>
            Design
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>Create logo</li>
          </ul>

          <div className={styles.heading}>
            Answer Key
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>Add answer key to main view</li>
            <li className={styles.listItem}>Lock game when answers seen</li>
            <li className={styles.listItem}>Display answers when game is finished</li>
          </ul>

          <div className={styles.heading}>
            Coins
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>Award a daily amount of coins</li>
            <li className={styles.listItem}>Award coins on game victory</li>
            <li className={styles.listItem}>Charge coins for match games</li>
            <li className={styles.listItem}>Charge coins for extra games</li>
          </ul>

          <div className={styles.feedback}>
            Have feedback? Please email <a href={'mailto:chrisubick@gmail.com'} target={'_blank'} rel="noreferrer">chrisubick@gmail.com</a>
          </div>

        </div>
      </div>
    )
  }
}