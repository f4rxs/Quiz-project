require("dotenv").config();
const config = {
    db:{
        host: process.env.DB_HOST || "127.0.0.1",
        user: process.env.DB_USER || "root",
        port: process.env.DB_PORT || 3306,
        password: process.env.DB_PASS || "F0r3ST112004",
        database: process.env.DB_NAME || "quizproject",
        
    }
}

module.exports = config;