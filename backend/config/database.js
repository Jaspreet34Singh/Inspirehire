import { Sequelize } from "sequelize"; 
import dotenv from "dotenv"
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

dotenv.config()

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE, // Database Name
    process.env.MYSQL_USER,     // User
    process.env.MYSQL_PASSWORD, // Password
    {
      host: process.env.HOST,    // Database Host
      dialect: "mysql",          // Database Type
      logging: false,            // Set true if you want SQL logs
      pool: {
        max: 5, 
        min: 0, 
        acquire: 30000, 
        idle: 10000
      }
    },
    {
        // MySQL specific options
        decimalNumbers: true, // Needed for proper decimal handling
        // For setting initial AUTO_INCREMENT values in tables
        initialAutoIncrement: {
          role: 1,
          user: 10000,
          job_category: 1,
          job_post: 50000,
          application: 40000,
          ai_screening: 70000,
          notification: 60000,
          education: 80000,
          work_exp: 81000,
          job_preference: 82000,
          security_question: 96000,
          security_ans: 95000,
          report: 99000
        }
    }
  );


sequelize
.authenticate()
.then(() => console.log("Database connected successfully"))
.catch((error) => console.error("Database connection error:", error));




export default sequelize;