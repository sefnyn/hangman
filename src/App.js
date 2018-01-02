/* Pieces of data required

- random word
- body parts
- guessed letters


Our state is:
- currentLetter
- mysteryWord
- incorrect guesses
- gameOver

*/

import React, { Component } from 'react';
import logo from './logo.svg';
import { Grid, Col, Image } from 'react-bootstrap';
import hangman0 from './images/145px-Hangman-0.png';
import hangman1 from './images/145px-Hangman-1.png';
import hangman2 from './images/145px-Hangman-2.png';
import hangman3 from './images/145px-Hangman-3.png';
import hangman4 from './images/145px-Hangman-4.png';
import hangman5 from './images/145px-Hangman-5.png';
import hangman6 from './images/145px-Hangman-6.png';
import hangmanWords from './data/words.json';
import './App.css';

class Header extends Component {
  render() {
    return (
      <Col className='header'>Hangman: <small>Guess the mystery word!</small></Col>
    );
  }
}

class DrawHangman extends Component {
  render() {
    return (
      <Image className='hangman' src={this.props.value} alt={this.props.value} />
    );
  }
}

class Status extends Component {
  render() {
     return (
       <Col className='status'>{this.props.status}</Col>
     );
  }
}

class MysteryWord extends Component {
  render() {
    return (
      <div>
        <Col className='word'>Mystery word: {this.props.word}</Col>
        <Col className='word'>{this.props.mystery}</Col>
      </div>
    );
  }
}

class Guesses extends Component {
  render() {
    return (
      <div>
        <Col className='guesses'>Incorrect guesses: {this.props.letters}</Col>
      </div>
    );
  }
}

class Footer extends Component {
  render() {
    return (
      <div>
        <Col className='footer'>Written by N Syrotiuk. Powered by React</Col>
        <Image className='App-logo' alt='logo' src={logo}/>
      </div>
    );
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordArray: generateMysteryWord(),
      letters: [], /* stores wrong guesses */
      value: '',   /* input letter */
      gameOver: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const letters = this.state.letters.slice();
    const wordArray = this.state.wordArray.slice();
    this.setState({
      value: e.target.value.toUpperCase(),
      letters: letters,
      wordArray: wordArray,
    });
  }

  handleSubmit(e) {
    console.log('you entered: ' + this.state.value);
    e.preventDefault();
  }

  render() {
    const word     = this.state.wordArray[0];
    const mystery  = this.state.wordArray[1];
    const letters  = this.state.letters;
    const drawings = [hangman0, hangman1, hangman2, hangman3, hangman4, hangman5, hangman6];
    const result = analyseGuess(this.state);
    let status;
    if (result) {
        status = result;
    } else {
        status = '';
    }

    return (
      <Grid className='grid'>
        <Header />
        <div className='hangman-panel'>
          <DrawHangman value={drawings[this.state.letters.length]} />
          <Status status={status} />
        </div>
        <div className='word-panel'>
          <MysteryWord word={word} mystery={mystery} />
          <Guesses letters={letters} />
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <input className='enter'
              type='text'
              placeholder='Please enter one letter...'
              maxLength='1'
              required
              value={this.state.value}
              onChange={this.handleChange}
              disabled={this.state.gameOver}
            />
          </form>
        </div>
        <Footer />
      </Grid>
    );
  }
}

class App extends Component {
  render() {
    return (
      <Game />
    );
  }
}

function generateMysteryWord() {
  /* Returns an array as follows:
   *  [word, mystery]
   *
   *  word contains the mystery word, e.g. ELASTIC
   *  mystery contains the current state of the solution, e.g., EL**T*C
   */
  var len = hangmanWords.length; /* length of global array */
  var random = Math.floor(Math.random() * len);
  var word = hangmanWords[random];
  word = word.replace(/-/g, ""); /* remove hyphens */
  word = word.toUpperCase();

  var mystery = '';
  for (var i=0; i < word.length; i++) {
    mystery = mystery + '*';
  }

  return [word, mystery];
}

function analyseGuess(state) {
  const word    = state.wordArray[0];
  const mystery = state.wordArray[1];
  const letters = state.letters;
  const guess   = state.value;

  var re = new RegExp(guess, 'g');
  var result = word.search(re);
  
  if (state.letters.length >= 6) {

    state.gameOver = true;
    return 'Game Over.  Solution: ' + word;

  } else if (word === mystery) {

    state.gameOver = true;
    return 'Congratulations!';

  } else if (guess === '') {

    return null;

  } else if (letters.indexOf(guess) > -1) {

    return 'You already guessed ' + guess;
    
  } else if (result === -1) {

    /* did not find a match */
    state.letters.push(guess);
    return 'Sorry, no match!';

  } else if (result >= 0) {

    /* found at least one match */
    var newstr = replaceChar(mystery, result, guess);
    state.wordArray[1] = newstr;
    return 'Yup, found letter ' + guess + ' ...   :)';
  }
}

function replaceChar(str, index, chr) {
      if (index > str.length - 1) return str;
      return str.substr(0, index) + chr + str.substr(index + 1);
}

export default App;