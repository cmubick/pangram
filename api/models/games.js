/**
 * Model: Games
 */

const AWS = require('aws-sdk')
const shortid = require('shortid')
const utils = require('../utils')
const wordlistEnglish = require('wordlist-english')

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
})

/**
 * Register game
 * @param {string} game.letters Game email
 * @param {string} game.password Game password
 */
const create = async() => {

  let gameLetters = createGameLetters();

  

  // create score array



  // Validate
  if (!game.email) {
    throw new Error(`"email" is required`)
  }
  if (!game.password) {
    throw new Error(`"password" is required`)
  }
  if (!utils.validateEmailAddress(game.email)) {
    throw new Error(`"${game.email}" is not a valid email address`)
  }

  // Check if game is already registered
  const existingGame = await getByEmail(game.email)
  if (existingGame) {
    throw new Error(`A game with email "${game.email}" is already registered`)
  }

  game.password = utils.hashPassword(game.password)

  // Save
  const params = {
    TableName: process.env.db,
    Item: {
      hk: game.email,
      sk: 'game',
      sk2: shortid.generate(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      password: game.password,
    }
  }

  await dynamodb.put(params).promise()
}

/**
 * Get game by email address
 * @param {string} email
 */

const getByEmail = async(email) => {

  // Validate
  if (!email) {
    throw new Error(`"email" is required`)
  }
  if (!utils.validateEmailAddress(email)) {
    throw new Error(`"${email}" is not a valid email address`)
  }

  // Query
  const params = {
    TableName: process.env.db,
    KeyConditionExpression: 'hk = :hk',
    ExpressionAttributeValues: { ':hk': email }
  }

  let game = await dynamodb.query(params).promise()

  game = game.Items && game.Items[0] ? game.Items[0] : null
  if (game) {
    game.id = game.sk2
    game.email = game.hk
  }
  return game
}

/**
 * Get game by id
 * @param {string} id
 */

const getById = async(id) => {

  // Validate
  if (!id) {
    throw new Error(`"id" is required`)
  }

  // Query
  const params = {
    TableName: process.env.db,
    IndexName: process.env.dbIndex1,
    KeyConditionExpression: 'sk2 = :sk2 and sk = :sk',
    ExpressionAttributeValues: { ':sk2': id, ':sk': 'game' }
  }
  let game = await dynamodb.query(params).promise()

  game = game.Items && game.Items[0] ? game.Items[0] : null
  if (game) {
    game.id = game.sk2
    game.email = game.hk
  }
  return game
}

/**
 * Convert game record to public format
 * This hides the keys used for the dynamodb's single table design and returns human-readable properties.
 * @param {*} game 
 */
const convertToPublicFormat = (game = {}) => {
  game.email = game.hk || null
  game.id = game.sk2 || null
  if (game.hk) delete game.hk
  if (game.sk) delete game.sk
  if (game.sk2) delete game.sk2
  if (game.password) delete game.password
  return game
}

const createGameLetters = () => {
  let gameLetters = '';
  let validCharacters = 'abcdefghijklmnopqrstuvwxyz';
  let vowels = 'aeiou';
  
  // add a vowel
  let char = vowels.charAt(Math.floor(Math.random() * vowels.length));
  gameLetters += char;
  validCharacters.replace(char, '');

  // add 6 random unique letters
  for ( var i = 0; i < 6; i++ ) {
    char = validCharacters.charAt(Math.floor(Math.random() * validCharacters.length));
    gameLetters += char;
    validCharacters.replace(char, '');
  }
  
  return gameLetters;
}

const confirmGamePlay = () => {

  let gameLetters = createGameLetters;

  // get list of words

  wordlistEnglish

  // check for pangram
}

module.exports = {
  register,
  getByEmail,
  getById,
  convertToPublicFormat,
}
