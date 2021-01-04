import React, { Component } from 'react'
import { 
  withRouter 
} from 'react-router-dom'
import styles from './Dashboard.module.css'
import {
  getSession,
  deleteSession,
  createGameLetters
} from '../../utils'
import PacmanLoader from "react-spinners/PacmanLoader";
import { css } from "@emotion/core";

class Dashboard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      wordEntry: '',
      loading: false,
      answers: [],
      message: '',
      points: 0
    }
    this.logout = this.logout.bind(this)
    this.createGame = this.createGame.bind(this);
    this.onEntryChange = this.onEntryChange.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  async componentDidMount() {
    const userSession = getSession()
    this.setState({
      session: userSession,
    }, () => {
      this.createGame();
    });
  }

  logout() {
    deleteSession()
    this.props.history.push(`/`)
  }

  createGame() {
    this.setState({
      loading: true
    }, () => {
      setTimeout(() => { // TODO: fix loading flag, then remove setTimeout hack
        createGameLetters().then((data) => {
          if (!data.sucess) {
            this.createGame();
          } else {
            this.setState({
              game: data,
              loading: false,
              wordEntry: '',
              answers: [],
              message: '',
              points: 0
            });
          }
        });
      }, 10);
    });
  }

  onKeyPress(event) {
    console.log(event);
    if (event.key === 'Enter') {
      this.handleFormSubmit();
    }
  };

  onEntryChange(letter) {
    let currentWordEntry = this.state.wordEntry;
    currentWordEntry += letter;
    this.setState({
      wordEntry: currentWordEntry,
      message: ''
    });
  }

  onBackClick() {
    let currentWordEntry = this.state.wordEntry;
    currentWordEntry = currentWordEntry.slice(0, -1);
    this.setState({
      wordEntry: currentWordEntry,
      message: ''
    });
  }

  onSubmit() {
    let {wordEntry, game, answers, points, message } = this.state;
    if (!wordEntry.includes(game.magicLetter)) {
      this.setState({
        message: `Must use the magic letter.`,
        wordEntry: ''
      })
    } else if (wordEntry.length < 4) {
      this.setState({
        message: `Four letter minimum.`,
        wordEntry: ''
      })
    } else if (game.words.indexOf(wordEntry) >= 0) {
      if (answers.indexOf(wordEntry) === -1) {
        answers.push(wordEntry);
        if (game.pangram.indexOf(wordEntry) >= 0) {
          points = points + 20;
          message = 'PANGRAM! +20 Points'
        } else {
          points = points + wordEntry.length;
          message = `Great! +${wordEntry.length} Points`
        }
        this.setState({
          message: message,
          answers: answers,
          points: points,
          wordEntry: ''
        })
      } else {
        this.setState({
          message: `Already found.`,
          wordEntry: ''
        })
      }
    } else {
      this.setState({
        message: `Not in our list.`,
        wordEntry: ''
      })
    }
  }

  render() {
    const override = css`
      display: block;
      margin: 0 auto;
      border-color: #F8E71C;
    `;
    return (
      <div className={`${styles.container} animateFadeIn`}>
        <div className={styles.containerInner}>

          <div className={styles.navigationContainer}>
            <div 
              className={`link`}
              onClick={this.createGame}>
                New
            </div>
            <div className={`${styles.artwork} animateFlicker`}>
              PANGRAM
            </div>
            <div 
              className={`link`}>
                { this.state.session ? this.state.session.userEmail : '' }
            </div>
            <div 
              className={`link`}
              onClick={this.logout}>
                logout
            </div>
          </div>

          {this.state.loading ? 
          <div className={`${styles.contentContainer}`}>
            <div>
              <PacmanLoader color={'#F8E71C'} loading={this.state.loading} css={override} />
            </div>
            <br/>
            <div className={`${styles.loadingMessage}`}>...Loading</div>
          </div> 
          : this.state?.game ?
            <div className={`${styles.contentContainer}`}>
              <div className={`${styles.gameStats}`}>
                <div className={`${styles.points}`}>{this.state.points} Points</div>
              </div>
              <div className={`${styles.wordEntryWrapper}`}>
                <span className={`${styles.wordEntry}`}>{this.state.wordEntry.toUpperCase()}</span>
              </div>

              <div>
                <button onClick={() => this.onEntryChange(this.state.game.gameLetters[0])} className={`${styles.letterButton}`}>{this.state.game.gameLetters[0].toUpperCase()}</button>
              </div>
              <div className={`${styles.buttonWrapper}`}>
                <button onClick={() => this.onEntryChange(this.state.game.gameLetters[1])} className={`${styles.letterButton}`}>{this.state.game.gameLetters[1].toUpperCase()}</button>
                <span className={`${styles.buttonWrapper}`}></span>
                <button onClick={() => this.onEntryChange(this.state.game.gameLetters[2])} className={`${styles.letterButton}`}>{this.state.game.gameLetters[2].toUpperCase()}</button>
              </div>
              <div className={`${styles.buttonWrapper}`}>
                <button onClick={() => this.onEntryChange(this.state.game.magicLetter)} className={`${styles.magicLetterButton}`}>{this.state.game.magicLetter.toUpperCase()}</button>
              </div>
              <div className={`${styles.buttonWrapper}`}>
                <button onClick={() => this.onEntryChange(this.state.game.gameLetters[3])} className={`${styles.letterButton}`}>{this.state.game.gameLetters[3].toUpperCase()}</button>
                <span className={`${styles.buttonSpacer}`}></span>
                <button onClick={() => this.onEntryChange(this.state.game.gameLetters[4])} className={`${styles.letterButton}`}>{this.state.game.gameLetters[4].toUpperCase()}</button>
              </div>
              <div className={`${styles.buttonWrapper}`}>
                <button onClick={() => this.onEntryChange(this.state.game.gameLetters[5])} className={`${styles.letterButton}`}>{this.state.game.gameLetters[5].toUpperCase()}</button>
              </div>
              <div className={`${styles.actionButtonWrapper}`}>
                <button onClick={this.onBackClick} className={`${styles.actionButton}`}>
                  Delete
                </button>
                <button onClick={this.onSubmit} className={`${styles.actionButton}`} onKeyPress={this.onKeyPress}>
                  SUBMIT
                </button>
              </div>
              <div className={`${styles.errorWrapper}`}>
                {this.state.message === '' ? null :
                  <span className={`${styles.errorMessage}`}>{this.state.message}</span>
                }
              </div>
              <div className={`${styles.gameStats}`}>
                <div className={`${styles.points}`}>
                  Words Found: <br/>
                  {this.state.answers.map((answer, index) => {
                    return (
                      <span key={answer}>
                        {answer}
                        {this.state.game.pangram.indexOf(answer) >= 0 ?
                          <span>(pangram!)</span> : null
                        }<span hidden={this.state.answers.length < (index + 2)}>, </span>
                      </span>
                  )})}
                </div>
              </div>
          </div> : null }
        </div> 
      </div>
    )
  }
}

export default withRouter(Dashboard)