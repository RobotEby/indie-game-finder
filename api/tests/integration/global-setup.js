const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const DATABASE_DIR = path.resolve(__dirname, '..', '..', '..', 'database');

async function connectWithRetry(config, attempts = 30) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await mysql.createConnection(config);
    } catch (err) {
      lastError = err;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw lastError;
}

module.exports = async () => {
  // schema.sql runs DROP DATABASE IF EXISTS indieGameFinder, so never run this
  // by accident against a database that holds data you care about.
  if (process.env.RUN_DB_INTEGRATION !== '1') {
    throw new Error(
      'Refusing to run: these tests DROP and recreate the "indieGameFinder" database. ' +
        'Point DB_HOST/DB_USER/DB_PASSWORD at a disposable MySQL 8.0.16+ server and set RUN_DB_INTEGRATION=1.',
    );
  }

  const connection = await connectWithRetry({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });
  try {
    await connection.query(fs.readFileSync(path.join(DATABASE_DIR, 'schema.sql'), 'utf8'));
    await connection.query(fs.readFileSync(path.join(DATABASE_DIR, 'seed.sql'), 'utf8'));
  } finally {
    await connection.end();
  }
};
