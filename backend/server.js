import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import sequelize from "./config/database.js";

// Import models
import User from "./modules/userModule.js";
import Role from "./modules/role.model.js";
import JobCategory from "./modules/jobCategory.model.js";
import JobPost from "./modules/job.model.js";
import WorkExp from "./modules/workExp.model.js";
import Education from "./modules/education.model.js";
import JobPreference from "./modules/jobPreference.model.js";
import Application from "./modules/application.model.js";
import AiScreening from "./modules/aiScreening.model.js";
import Notification from "./modules/notification.model.js";
import Report from "./modules/report.model.js";
import SecurityQuestion from "./modules/securityQuestions.model.js";
import SecurityAnswer from "./modules/securtiyAnswer.js";
import RejectionEmailJob from "./modules/RejectionEmailJob.model.js";

// Import routes
import userRoutes from "./routes/userRegisterRoute.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applyRoutes from "./routes/ApplicationRoute.js"
import screeningRouter from "./routes/ScreeningRoutes.js"
import adminRoutes from "./routes/adminRoutes.js";
import preferrenceRouter from "./routes/preferrenceRouter.js"
import { workerData } from "worker_threads";
import ApplicantProfileRoute from "./routes/ApplicantProfileRoute.js";
import viewApplicationRoutes from "./routes/viewApplicationRoutes.js";
import ViewApplicantApplication from "./routes/ViewApplicantApplicationRoute.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Define model associations
// Role associations
Role.hasMany(User, { foreignKey: 'Role_ID' });
User.belongsTo(Role, { foreignKey: 'Role_ID' });

// JobCategory associations
JobCategory.hasMany(JobPost, { foreignKey: 'Category_ID' });
JobPost.belongsTo(JobCategory, { foreignKey: 'Category_ID' });

JobCategory.hasMany(JobPreference, { foreignKey: 'Category_ID' });
JobPreference.belongsTo(JobCategory, { foreignKey: 'Category_ID' });

User.hasMany(JobPost, { 
  foreignKey: 'User_ID',
  as: 'JobPosts', // Optional but recommended
  onDelete: 'CASCADE', // Optional: handles deletion behavior
  onUpdate: 'CASCADE'  // Optional: handles update behavior
});

JobPost.belongsTo(User, { 
  foreignKey: 'User_ID',
  as: 'User', // Optional but recommended
  onDelete: 'CASCADE', // Optional: handles deletion behavior
  onUpdate: 'CASCADE'  // Optional: handles update behavior
});


User.hasMany(WorkExp, { foreignKey: 'USER_ID' });
WorkExp.belongsTo(User, { foreignKey: 'USER_ID' });

User.hasMany(Education, { foreignKey: 'USER_ID' });
Education.belongsTo(User, { foreignKey: 'USER_ID' });

User.hasMany(JobPreference, { foreignKey: 'USER_ID' });
JobPreference.belongsTo(User, { foreignKey: 'USER_ID' });

User.hasMany(Application, { foreignKey: 'User_ID' });
Application.belongsTo(User, { foreignKey: 'User_ID' });

User.hasMany(Notification, { foreignKey: 'User_ID' });
Notification.belongsTo(User, { foreignKey: 'User_ID' });

User.hasMany(Report, { foreignKey: 'USER_ID' });
Report.belongsTo(User, { foreignKey: 'USER_ID' });

User.hasMany(SecurityAnswer, { foreignKey: 'User_ID' });
SecurityAnswer.belongsTo(User, { foreignKey: 'User_ID' });

// JobPost associations
JobPost.hasMany(Application, { foreignKey: 'Job_ID' });
Application.belongsTo(JobPost, { foreignKey: 'Job_ID' });

// Application associations
Application.hasMany(AiScreening, { foreignKey: 'Application_ID' });
AiScreening.belongsTo(Application, { foreignKey: 'Application_ID' });

Application.hasMany(Notification, { foreignKey: 'Application_ID' });
Notification.belongsTo(Application, { foreignKey: 'Application_ID' });

// SecurityQuestion associations
SecurityQuestion.hasMany(SecurityAnswer, { foreignKey: 'Security_Question_ID' });
SecurityAnswer.belongsTo(SecurityQuestion, { foreignKey: 'Security_Question_ID' });

// Sync database with models
RejectionEmailJob.sync();
WorkExp.sync({alter: true})


sequelize.sync() 
  .then(() => console.log("Database synchronized with Sequelize models"))
  .catch(error => console.error("Database sync error:", error));

// Initialize Express app
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/register/form-data", userRoutes); 


// Home route
app.get('/', (req, res) => {
  res.send('InspireHire API is running');
});

// Auth route
app.use("/auth", authRoutes);

// Job route
app.use("/jobs", jobRoutes);

app.use("/apply", applyRoutes)

app.use("/application", screeningRouter)

app.use("/view-applications", viewApplicationRoutes);

//  admin route
app.use("/admin", adminRoutes);
app.use("/preferrence", preferrenceRouter)
app.use("/viewApplication",ViewApplicantApplication)
app.use("/reports", reportRoutes);

app.use("/applicantProfile", ApplicantProfileRoute)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// Start server
app.listen(port, () => {
  console.log(`InspireHire server running on port ${port}`);
});


export default app;