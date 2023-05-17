if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

/* For loading Docker secrets into Node process */
// if (process.env.NODE_ENV === 'production') {
//   require('dotenv').config({ path: process.env.BACKEND_SECRETS_FILE })
// }

let MONGODB_URI = process.env.MONGODB_URI || undefined

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

const DATABASE_URL = process.env.NODE_ENV !== 'production'
  ? process.env.DATABASE_URL_LOCAL
  : process.env.DATABASE_URL

const PORT = process.env.PORT || 8080

module.exports = { PORT, MONGODB_URI, DATABASE_URL }
