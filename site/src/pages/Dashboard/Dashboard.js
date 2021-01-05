import React, { Component } from 'react'
import { 
  withRouter 
} from 'react-router-dom'
import styles from './Dashboard.module.css'
import {
  getSession,
  deleteSession,
  createGameLetters,
  getPremadeGames
} from '../../utils'
import GridLoader from 'react-spinners/GridLoader';
import { css } from '@emotion/core';
import { GiHamburgerMenu } from 'react-icons/gi';
import { FiRefreshCcw } from 'react-icons/fi';
import Drawer from 'react-drag-drawer'
import ReactTimer from '@xendora/react-timer';
import KeyboardEventHandler from 'react-keyboard-event-handler';

class Dashboard extends Component {

  constructor(props) {
    super(props)
    this.state = {
      wordEntry: '',
      loading: false,
      answers: [],
      message: '',
      points: 0,
      isOpen: false,
      level: 'beginner',
      gameLetters: '',
      gameIndex: 0,
      loadedGames: []
    }
    this.logout = this.logout.bind(this)
    this.createGame = this.createGame.bind(this);
    this.onEntryChange = this.onEntryChange.bind(this);
    this.onBackClick = this.onBackClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.openDrawer = this.openDrawer.bind(this);
    this.convertSecondsToTime = this.convertSecondsToTime.bind(this);
    this.updateLevel = this.updateLevel.bind(this);
    this.onSuffleLetters = this.onSuffleLetters.bind(this);
    this.getWordEntry = this.getWordEntry.bind(this);
    this.handleKeystroke = this.handleKeystroke.bind(this);
  }

  async componentDidMount() {
    const userSession = getSession()
    this.setState({
      session: userSession,
    }, () => {
      const games = getPremadeGames();
      this.setState({
        loadedGames: games,
        game: games[this.state.gameIndex],
        gameLetters: games[this.state.gameIndex].gameLetters,
        loading: false,
        wordEntry: '',
        answers: [],
        message: '',
        points: 0
      });
    });
  }

  logout() {
    deleteSession()
    this.props.history.push(`/`)
  }

  createGame() {
    this.setState({
      loading: true,
      isOpen: false
    }, () => {
      let { loadedGames, gameIndex } = this.state;
      if (gameIndex < loadedGames.length -1) {
        ++ gameIndex;
        this.setState({
          game: loadedGames[gameIndex],
          gameIndex: gameIndex,
          gameLetters: loadedGames[gameIndex].gameLetters,
          loading: false,
          wordEntry: '',
          answers: [],
          message: '',
          points: 0
        })
      } else {
        setTimeout(() => { 
          createGameLetters().then((data) => {
            if (!data.success) {
              this.createGame();
            } else {
              this.setState({
                game: data,
                gameLetters: data.gameLetters,
                loading: false,
                wordEntry: '',
                answers: [],
                message: '',
                points: 0
              });
            }
          });
        }, 10);
      }
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
    let me = this;
    currentWordEntry += letter;
    this.setState({
      wordEntry: currentWordEntry,
      message: ''
    }, () => {
      me.getWordEntry();
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

  onSuffleLetters() {
    let { gameLetters } = this.state;
    let arr = gameLetters.split('');
    arr.sort(() => {
      return 0.5 - Math.random();
    });  
    gameLetters = arr.join('');
    this.setState({
      gameLetters: gameLetters
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
        let me = this;
        this.setState({
          message: message,
          answers: answers,
          points: points,
          wordEntry: ''
        }, function() {
          me.updateLevel();
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
    setTimeout(() => {
      this.setState({
        message: ''
      })
    }, 2000);
  }

  closeDrawer() {
    this.setState({isOpen: false});
  }
  
  openDrawer() {
    this.setState({isOpen: true});
  }

  convertSecondsToTime(time) {
    let date = new Date(0);
    date.setSeconds(time);
    return date.toISOString().substr(11, 8);
  }

  updateLevel() {
    const { game, points } = this.state;
    switch(true) {
      case game.levels[1] > points && points >= game.levels[0]:
        this.setState({
          level: 'intermediate'
        });
        break;
      case game.levels[2] > points && points >= game.levels[1]:
        this.setState({
          level: 'awesome'
        });
        break;
      case points > game.levels[2]:
        this.setState({
          level: 'genius'
        });
        break;
      default:
        this.setState({
          level: 'beginner'
        });
        break;
    }
  }

  getWordEntry() {
    let { wordEntry, game } = this.state;
    wordEntry = wordEntry.toUpperCase();
    let arr = wordEntry.split('');
    return arr.map((letter, index) => {
      if (letter === game.magicLetter.toUpperCase()) {
        return (
          <span className={styles.magicLetterEntry} key={`${letter}-${index}`}>{letter}</span>
        )
      } else {
        return (
          <span key={`${letter}-${index}`}>{letter}</span>
        )
      }
    });
  }

  handleKeystroke(key) {
    const { gameLetters, game } = this.state;
    if (gameLetters.includes(key) || key === game.magicLetter){
      this.onEntryChange(key);
    } else if (key === 'enter') {
      this.onSubmit();
    } else if (key === 'backspace') {
      this.onBackClick();
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
        <div className={styles.topNav}>
          <div 
            className={`${styles.navButton} link`}
            onClick={this.openDrawer}>
              <GiHamburgerMenu />
          </div>
          <div className={`${styles.artwork} animateFlicker`}>
            PANGRAM
          </div>
        </div>
        <Drawer 
          open={this.state.isOpen}
          onRequestClose={this.closeDrawer}
          onOpen={this.openDrawer}
          allowClose={true}
        >
          <div className={styles.navigationContainer}>
            <div 
              className={`link`}
              onClick={this.createGame}>
                New Game
            </div>
            <div 
              className={`link`}
              onClick={this.openDrawer}>
                { this.state.session ? this.state.session.userEmail : '' }
            </div>
            <div 
              className={`link`}
              onClick={this.logout}>
                logout
            </div>
          </div>
        </Drawer>

          {this.state.loading ? 
          <div className={`${styles.contentContainer}`}>
            <div className={styles.loadingWrapper}>
              <div>
                <GridLoader color={'#F8E71C'} loading={this.state.loading} css={override} />
              </div>
              <br/>
              <div className={`${styles.loadingMessage}`}>...Loading</div>
            </div>
          </div> 
          : this.state?.game ?
            <div className={`${styles.contentContainer}`}>
              <div className={`${styles.gameStats}`}>
                <div className={`${styles.points}`}>
                  <ReactTimer
                    start={0}
                    end={() => false}
                    onEnd={value => console.log('ENDED WITH VALUE', value)}
                    onTick={value => value + 1}
                    className={styles.timer}
                  >
                    {time => <div>{this.convertSecondsToTime(time)}</div>}
                  </ReactTimer>
                  <div>{this.state.level}</div>
                  <div>{this.state.points} Points</div>
                </div>
              </div>
              <div className={`${styles.wordEntryWrapper}`}>
                <div className={`${styles.wordEntry}`}>{this.getWordEntry()}</div>
              </div>

              <div className={`${styles.letterButtonContainer}`}>
                <div>
                  <button onClick={() => this.onEntryChange(this.state.gameLetters[0])} className={`${styles.letterButton}`}>
                    <span>{this.state.gameLetters[0].toUpperCase()}</span>
                  </button>
                </div>
                <div className={`${styles.buttonWrapper}`}>
                  <button onClick={() => this.onEntryChange(this.state.gameLetters[1])} className={`${styles.letterButton}`}>
                      <span>{this.state.gameLetters[1].toUpperCase()}</span>
                    </button>
                  <span className={`${styles.buttonWrapper}`}></span>
                  <button onClick={() => this.onEntryChange(this.state.gameLetters[2])} className={`${styles.letterButton}`}>
                    <span>{this.state.gameLetters[2].toUpperCase()}</span>
                  </button>
                </div>
                <div className={`${styles.buttonWrapper}`}>
                  <button onClick={() => this.onEntryChange(this.state.game.magicLetter)} className={`${styles.magicLetterButton}`}>
                    <span>{this.state.game.magicLetter.toUpperCase()}</span>
                  </button>
                </div>
                <div className={`${styles.buttonWrapper}`}>
                  <button onClick={() => this.onEntryChange(this.state.gameLetters[3])} className={`${styles.letterButton}`}>
                    <span>{this.state.gameLetters[3].toUpperCase()}</span>
                  </button>
                  <span className={`${styles.buttonSpacer}`}></span>
                  <button onClick={() => this.onEntryChange(this.state.gameLetters[4])} className={`${styles.letterButton}`}>
                    <span>{this.state.gameLetters[4].toUpperCase()}</span>
                  </button>
                </div>
                <div className={`${styles.buttonWrapper}`}>
                  <button onClick={() => this.onEntryChange(this.state.gameLetters[5])} className={`${styles.letterButton}`}>
                    <span>{this.state.gameLetters[5].toUpperCase()}</span>
                    </button>
                </div>
              </div>
              <div className={`${styles.actionButtonWrapper}`}>
                <button onClick={this.onBackClick} className={`${styles.actionButton}`}>
                  DELETE
                </button>
                <button className={`${styles.shuffleButton}`} onClick={this.onSuffleLetters}>
                  <FiRefreshCcw />
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
              {this.state.answers.length > 0 ?
              <div className={`${styles.answersWrapper}`}>
                <div className={`${styles.words}`}>
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
              </div> : null }
          </div> : null }
        </div>
        <KeyboardEventHandler
            key={'keyboardEventHandler'}
            handleKeys={['alphanumeric', 'enter', 'backspace']}
            onKeyEvent={(keyboardKey, e) => this.handleKeystroke(keyboardKey)} /> 
      </div>
    )
  }
}

export default withRouter(Dashboard)