import mysql from "mysql2"
import dotenv from "dotenv"

dotenv.config()

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()


async function testDBConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Database connected successfully.");
        connection.release();
    } catch (err) {
        console.error("Database connection error:", err);
    }
}


testDBConnection();


export default pool;