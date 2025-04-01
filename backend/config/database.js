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
      logging: false,            
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
          user: 10001,
          job_category: 1,
          job_post: 50001,
          application: 40001,
          ai_screening: 70001,
          notification: 60001,
          education: 80001,
          work_exp: 81001,
          job_preference: 82001,
          security_question: 96001,
          security_ans: 95001,
          report: 99001
        }
    }
  );


sequelize
.authenticate()
.then(() => console.log("Database connected successfully"))
.catch((error) => console.error("Database connection error:", error));




export default sequelize;