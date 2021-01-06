/**
 * Model: Games
 */

const AWS = require('aws-sdk')
const shortid = require('shortid')

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION
})

const create = async(game) => {
  const id = shortid.generate();
  const params = {
    TableName: process.env.db,
    Item: {
      hk: game.magicLetter + '-' + game.gameLetters,
      sk: 'game',
      sk2: id,
      id: id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      panagram: game.pangram,
      words: game.words,
      gameLetters: game.gameLetters,
      magicLetter: game.magicLetter,
      levels: game.levels
    }
  }

  await dynamodb.put(params).promise()
}

const update = async(game) => {
  const params = {
    TableName: process.env.db,
    Item: {
      hk: game.magicLetter + '-' + game.gameLetters,
      sk: 'game',
      sk2: game.id,
      id: game.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      panagram: game.pangram,
      words: game.words,
      gameLetters: game.letters,
      magicLetter: game.magicLetter,
      levels: game.levels
    }
  }

  await dynamodb.put(params).promise()
}

const getByLetters = async(magicLetter, letters) => {

  // Validate
  if (!letters) {
    throw new Error(`letters are required`)
  }
  if (!magicLetter) {
    throw new Error(`magic letter are required`)
  }

  const searchString = magicLetter + '-' + letters;

  // Query
  const params = {
    TableName: process.env.db,
    KeyConditionExpression: 'hk = :hk',
    ExpressionAttributeValues: { ':hk': searchString }
  }

  let game = await dynamodb.query(params).promise()

  game = game.Items && game.Items[0] ? game.Items[0] : null
  if (game) {
    game.id = game.sk2
  }
  return game
}

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
    game.hk = game.hk
  }
  return game
}

const convertToPublicFormat = (game = {}) => {
  game.email = game.hk || null
  game.id = game.sk2 || null
  if (game.hk) delete game.hk
  if (game.sk) delete game.sk
  if (game.sk2) delete game.sk2
  if (game.password) delete game.password
  return game
}

module.exports = {
  create,
  update,
  getByLetters,
  // getAllByUser,
  getById,
  convertToPublicFormat,
}
