import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import router from "./routes/userRegisterRoute.js"
import testing from "./routes/userModifyRoute.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });



dotenv.config()
const app = express()
const port = process.env.PORT


// Middleware for JSON parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


//Middlewares
app.use("/register/form-data", router);
app.use("/userModify", testing);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})