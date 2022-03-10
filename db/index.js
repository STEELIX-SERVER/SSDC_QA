
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.HOST || 'localhost',
  port:   host: process.env.HOST || 'localhost',
  user: process.env.USER || 'postgres',
  password:   user: process.env.USER || 'postgres',
  database: process.env.DATABASE || 'qa',
})

pool.connect();

// ;(async () => {
//   const client = await pool.connect()
//   try {
//     const res = await client.query('SELECT * FROM answers_photos LIMIT 5')
//     console.log(res.rows)
//   } finally {
//     // Make sure to release the client before any error handling,
//     // just in case the error handling itself throws an error.
//     client.release()
//   }
// })().catch(err => console.log(err.stack))


module.exports = pool;
