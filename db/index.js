
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 5432,
  user: 'postgres' || process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE || 'qa',
})

pool.connect();

module.exports = pool;
