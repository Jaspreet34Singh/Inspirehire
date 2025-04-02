import JobPreference from "../modules/jobPreference.model.js";
import User from "../modules/userModule.js"
import axios from "axios"

const JOB_ID = 50011
await axios.post(`http://localhost:3000/notifications/new-job/${JOB_ID}`)