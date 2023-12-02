const mysql = require('mysql2/promise');
const config = require('./config');

let connection;

const connect = async () => {
  try {
    connection = await mysql.createConnection(config.db);
    console.log(`Connection to ${process.env.DB_NAME} is successful`);
  } catch (error) {
    console.error(`Error connecting to ${process.env.DB_NAME}`, error);
    process.exit();
  }
};

const query = async (sql, params) => {
  if (!connection) {
    await connect();
  }
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error(`Query error -> ${sql}: ${error}`);
    throw new Error(error);
  }
};


module.exports = {
  query,
}

