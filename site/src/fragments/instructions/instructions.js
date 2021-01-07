import React, { Component } from 'react'
import styles from './instructions.module.css'

export default class Instructions extends Component {

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
            How to Play
          </div>
          <div className={styles.heading}>
            Create words
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>Words must have at least 4 letters</li>
            <li className={styles.listItem}>Words must include the magic letter</li>
            <li className={styles.listItem}>Our word list comes from the Scrabble dictionary</li>
          </ul>

          <div className={styles.heading}>
            Score points
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>Score 20 points for a pangram which must contain each letter at least once. Each puzzle includes at least one pangram.</li>
            <li className={styles.listItem}>Score one point per letter for any non-pangram word.</li>
            <li className={styles.listItem}>Increase your points to level up.</li>
          </ul>

          <div className={styles.heading}>
            Levels
          </div>
          <ul className={styles.list}>
            <li className={styles.listItem}>Beginner - we all start somewhere.</li>
            <li className={styles.listItem}>Intermediate - 8% of possible points</li>
            <li className={styles.listItem}>Awesome - 20% of possible points</li>
            <li className={styles.listItem}>Advanced - 30% of possible points</li>
            <li className={styles.listItem}>Incredible - 40% of possible points</li>
            <li className={styles.listItem}>Genius - 60% of possible points</li>
            <li className={styles.listItem}>Complete! - 100% of possible points</li>
          </ul>

          <div className={styles.feedback}>
            Have feedback? Please email <a href={'mailto:chrisubick@gmail.com'} target={'_blank'} rel="noreferrer">chrisubick@gmail.com</a>
          </div>
        </div>
      </div>
    )
  }
}