import nodemailer from "nodemailer";
import dotenv from "dotenv";

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "f13779e9238aeb",
        pass: "57b58cdb05833a"
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

export default {
  applicantAcknowledgementEmail,
  sendEmailToHR
};




