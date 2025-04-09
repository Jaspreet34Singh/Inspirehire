import nodemailer from "nodemailer";
import dotenv from "dotenv";

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "934cd34086b63a",
        pass: "e4f06d5db9e646"
    }
});

dotenv.config();

// Function to send application acknowledgement email (FR-021)
export const applicantAcknowledgementEmail = async (applicantName, applicantEmail, jobId, appliedDate) => {
  try {

    const mailOptions = {
      from: "inspirehire.noreply@gmail.com",
      to: applicantEmail,
      subject: `Application Received - Job ID: ${jobId}`,
      text: `Dear ${applicantName},\n\nThank you for submitting your application for Job ID: ${jobId}.\n\nWe have received your application on ${appliedDate}. Our team will review your application and get back to you soon.\n\nBest regards,\nRecruitment Team`
    };

    await transporter.sendMail(mailOptions);
    console.log("Acknowledgement email sent successfully!");
    return { success: true, message: "Acknowledgement email sent successfully" };
  } catch (error) {
    console.error("Error sending acknowledgement email:", error);
    return { success: false, message: "Failed to send acknowledgement email", error };
  }
};



// Function to send email to HR for a qualified applicant (FR-023)
export const sendEmailToHR = async (applicantName, applicantEmail, userID, jobId, hrEmail, applicationID) => {
    try{

        const mailOptions = {
            from: "inspirehire.noreply@gmail.com",
            to: hrEmail,
            subject: `Qualified Applicant for - Job ID: ${jobId}`,
            text: `Dear HR Team,\n\nA new qualified candidate has been identified:\n\n Application ID: ${applicationID}\nName: ${applicantName}\nEmail: ${applicantEmail}\nUser ID: ${userID}\nJob ID: ${jobId}\n\nPlease review the application and proceed with the next steps in the recruitment process.\n\nBest regards,\nRecruitment System`
        };
        await transporter.sendMail(mailOptions);
        return { success: true, message: "HR email sent successfully" };

    }
    catch(error){
        console.log("Error from HR emailing section" + error)
    }
};


export const sendRejectionEmail = async (name, email, jobId) => {
    try {
      // Assuming you already have your transporter configured for Mailtrap
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Update Regarding Your Application (Job ID: ${jobId})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #333;">Application Status Update</h2>
            <p>Dear ${name},</p>
            <p>Thank you for your interest in the position (Job ID: ${jobId}) and for taking the time to apply.</p>
            <p>After carefully reviewing all applications, we regret to inform you that we have decided to pursue other candidates whose qualifications better match our current needs.</p>
            <p>We appreciate your interest in our organization and wish you the best in your job search.</p>
            <p>Best regards,</p>
            <p>The Hiring Team</p>
          </div>
        `
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log(`Rejection email sent to ${email}: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('Error sending rejection email:', error);
      throw error;
    }
  };

export default {
  applicantAcknowledgementEmail,
  sendEmailToHR
};




