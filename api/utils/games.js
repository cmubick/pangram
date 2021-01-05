import scrabble from 'scrabble';

export const createGame = async () => {
  let response = {};
  let gameLetters = getRandomLetters();
  let numberOfTries = 1;
  let magicLetter = gameLetters.charAt(Math.floor(Math.random() * gameLetters.length));
  
  while(!validateLettersArePlayable(gameLetters, magicLetter)) {
    gameLetters = getRandomLetters();
    magicLetter = gameLetters.charAt(Math.floor(Math.random() * gameLetters.length));
    ++numberOfTries;
  }
  
  let rawWords = scrabble(gameLetters + gameLetters + gameLetters + gameLetters + gameLetters + gameLetters);
  let words = [];
  let pangram = [];

  for(let i = 0; i < rawWords.length; i++) {
    if (rawWords[i].includes(magicLetter) && rawWords[i].length > 3) {
      words.push(rawWords[i]);
      if (rawWords[i].length === gameLetters.length) {
        let regexString = constructRegex(gameLetters);
        let regex = RegExp(regexString);
        let response = regex.test(rawWords[i]);
        if (response) {
          pangram.push(rawWords[i]);
        }
      }
    }
  }

  response.sucess = true;

  if (words.length < 10 || pangram.length === 0) {
    response.sucess = false;
  }

  response.pangram = pangram;
  response.words = words;
  response.gameLetters = gameLetters.replace(magicLetter, '');
  response.magicLetter = magicLetter;
  response.numberOfTries = numberOfTries;
  response.levels = [5,15,25,35,45];
  console.log(response);
  return response;
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

const validateLettersArePlayable = (letters, magicLetter) => {
  const words = scrabble(letters + letters + letters + letters + letters + letters);

  if (words.length > 20) {
    for(let i = 0; i < words.length; i++) {
      let regexString = constructRegex(letters);
      let regex = RegExp(regexString);
      let response = regex.test(words[i]);
      if (response && words[i].includes(magicLetter)) {
        return true;
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