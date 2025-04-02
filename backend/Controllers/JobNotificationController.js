import User from '../modules/userModule.js';
import JobPost from '../modules/job.model.js';
import JobCategory from '../modules/jobCategory.model.js';
import JobPreference from "../modules/jobPreference.model.js"
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Use your existing Mailtrap transporter
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "f13779e9238aeb",
    pass: "57b58cdb05833a"
  }
});

// Send notifications when a new job is posted
 const sendNotificationForNewJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    
    // Get job details
    const job = await JobPost.findByPk(jobId, {
      include: [
        { 
          model: JobCategory, 
          as: "JobCategory",
          attributes: ["Category_ID", "Category_Name"]
        }
      ]
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const emails = [];
    // Find all users who have this job category in their preferences
        const usersWithMatchingPreference = await JobPreference.findAll({
    
    
              where: {
                Category_ID: job.Category_ID
              }
      
        });
        console.log(`Found ${usersWithMatchingPreference.length} users with matching preferences`);
    
        for(const user of usersWithMatchingPreference){
          console.log(user.USER_ID)
          const [userInfo] = await User.findAll({
            where :{
              USER_ID: user.USER_ID
            }
          })
          if(userInfo.dataValues.Email){
            emails.push(userInfo.dataValues.Email)
          }
       
        }
    
        console.log(emails)
    
    // Send notifications to these users
    const sentEmails = [];
    
    for (const email of emails) {
      // Create email content
      const mailOptions = {
        from: "inspirehire.noreply@gmail.com",
        to: email,
        subject: `New Job Alert: ${job.Job_Title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #333;">A new job matching your preferences is available!</h2>
            <h3>${job.Job_Title}</h3>
            <p><strong>Category:</strong> ${job.JobCategory.Category_Name}</p>
            <p><strong>Location:</strong> ${job.Job_Location}</p>
            <p><strong>Type:</strong> ${job.Job_Type}</p>
            <p><strong>Salary:</strong> ${job.Salary}</p>
            <p>${job.Job_Description.substring(0, 200)}...</p>
            <p>Application Deadline: ${new Date(job.Job_Deadline).toLocaleDateString()}</p>
            <a href="${process.env.FRONTEND_URL}/jobs/${job.JOB_ID}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Job Details</a>
          </div>
        `
      };

      // Send the email
      await transporter.sendMail(mailOptions);
      sentEmails.push(email);
    }

    res.status(200).json({ 
      success: true, 
      message: `Notifications sent to ${sentEmails.length} users with matching preferences`,
      notifiedUsers: sentEmails 
    });
    
  } catch (error) {
    console.error("❌ Error sending job notifications:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send job notifications", 
      error: error.message 
    });
  }
};

export default sendNotificationForNewJob;
