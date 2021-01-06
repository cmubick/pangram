import scrabble from 'scrabble';

export const createGameLetters = async () => {
  let response = {};
  let gameLetters = getRandomLetters();
  let numberOfTries = 1;
  let magicLetter = gameLetters.charAt(Math.floor(Math.random() * gameLetters.length));
  
  while(!validateLettersArePlayable(gameLetters)) {
    gameLetters = getRandomLetters();
    magicLetter = gameLetters.charAt(Math.floor(Math.random() * gameLetters.length));
    ++numberOfTries;
  }
  
  let rawWords = scrabble(gameLetters + gameLetters + gameLetters + gameLetters + gameLetters + gameLetters);
  let words = [];
  let pangram = [];
  response.success = false;

  for(let i = 0; i < rawWords.length; i++) {
    if (rawWords[i].includes(magicLetter) && rawWords[i].length > 3) {
      words.push(rawWords[i]);
      if (rawWords[i].length >= gameLetters.length) {
        let regexString = constructRegex(gameLetters);
        let regex = RegExp(regexString);
        let res = regex.test(rawWords[i]);
        if (res) {
          pangram.push(rawWords[i]);
          if(rawWords[i].length === gameLetters.length) {
            response.success = true;
          }
        }
      }
    }
  }

  if (words.length < 10 || pangram.length === 0) {
    response.sucess = false;
  }

  response.pangram = pangram;
  response.words = words;
  response.gameLetters = gameLetters.replace(magicLetter, '');
  response.magicLetter = magicLetter;
  response.numberOfTries = numberOfTries;
  response.levels = getLevels(response);
  console.log(response);
  return response;
}

const getLevels = (game) => {
  let levels = [];
  let totalPoints = getTotalPoints(game);
  levels[0] = Math.floor(totalPoints * .08);
  levels[1] = Math.floor(totalPoints * .2);
  levels[2] = Math.floor(totalPoints * .3);
  levels[3] = Math.floor(totalPoints * .4);
  levels[4] = Math.floor(totalPoints * .6);
  levels[5] = totalPoints;
  return levels;
}

const getTotalPoints = (game) => {
  let points = 0;
  game.words.forEach((word) => {
    if (game.pangram.includes(word)){
      points += 20;
    } else {
      points += word.length;
    }
  });
  return points;
}

const getRandomLetters = () => {
  let gameLetters = '';
  let validCharacters = 'abcdefghijklmnopqrstuvwxyz';
  let vowels = 'aeiou';
  
  // add a vowel
  let char = vowels.charAt(Math.floor(Math.random() * vowels.length));
  gameLetters += char;
  validCharacters = validCharacters.replace(char, '');

  // add 6 random unique letters
  for ( var i = 0; i < 6; i++ ) {
    char = validCharacters.charAt(Math.floor(Math.random() * validCharacters.length));
    gameLetters += char;
    validCharacters = validCharacters.replace(char, '');
  }
  return gameLetters;
}

const validateLettersArePlayable = (letters) => {
  const words = scrabble(letters + letters + letters + letters + letters + letters);

  if (words.length > 20) {
    for(let i = 0; i < words.length; i++) {
      if (words[i].length === letters.length) {
        let regexString = constructRegex(letters);
        let regex = RegExp(regexString);
        let response = regex.test(words[i]);
        if (response) {
          return true;
        }
      }
    }
  }

  return false;
}

const constructRegex = (letters) => {
  let regexString = '';
  for(let i = 0; i < letters.length; i++) {
    regexString += `(?=.*${letters[i]})`;
  }
  return regexString;
}