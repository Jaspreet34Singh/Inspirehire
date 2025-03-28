import User from '../modules/userModule.js';
import Application from '../modules/application.model.js';
import {sendEmailToHR, applicantAcknowledgementEmail} from '../utils/emailServices.js'
import axios from 'axios';
import {getEmailFromJobID, getApplicationDeadline} from "./EmailController.js"



export const getUserInformation = async (req, res) => {
  try {
    console.log( "This is from application controller" + req.params.id)
    // Fetch user by ID with associated information
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['Password'] // Exclude sensitive information
      },
    });

    // If user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Transform user data to remove sequelize-specific properties
    const userData = user.toJSON();

    res.status(200).json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user information',
      error: error.message
    });
  }
};



export const postApplicationData = async (req, res) => {
  try {

      // Destructure fields from req.body
      const { 
          name, 
          email, 
          userId, 
          contact, 
          EducationExp, 
          FieldRelatedExp, 
          OffFieldExp, 
          Job_ID,
          Applied_Date,
          ScreeningDetails 
      } = req.body;

      // Handle file paths
      const resumePath = req.files?.resume ? req.files.resume[0].path : null;
      const coverLetterPath = req.files?.coverLetter ? req.files.coverLetter[0].path : null;

      // Validate required fields
      if (!Job_ID || !userId) {
          return res.status(400).json({ 
              success: false,
              message: "Missing required fields" 
          });
      }

 

      // Insert application data into the database
      const newApplication = await Application.create({
          Name: name,
          Email: email,
          User_ID: userId,
          Contact: contact,
          EducationExp: EducationExp,
          FieldRelatedExp: FieldRelatedExp,
          OffFieldExp: OffFieldExp,
          Job_ID: Job_ID,
          Applied_Date: Applied_Date,
          ScreeningDetails: ScreeningDetails,
          Resume: resumePath,
          CoverLetter: coverLetterPath
      });

      console.log("Application successfully stored:", newApplication);

      // Get the newly created Application ID
      const applicationID = newApplication.Application_ID;
      

      //  Screening Function 
      const screeningResponse = await axios.post(`http://localhost:3000/application/${applicationID}/screen`);
      console.log("Screening Response:", screeningResponse.data);




      try{
        // Email Feature 
        const response = await getEmailFromJobID(Job_ID)
        const hrEmail = (response.email)

        // Acknowledgement Email to all applicants
        console.log("Sending applicant acknowlwdgement email ")
        await applicantAcknowledgementEmail(name, email, Job_ID, Applied_Date) 
  

        if (screeningResponse.data.success && screeningResponse.data.screeningResult.ScreeningDetails === "Next Step") {
          await sendEmailToHR(name, email, userId, Job_ID, hrEmail, applicationID);
          console.log("Applicant is Qualified! Sending email to HR");
        }
      }catch(error){
        console.log("Error in applicant controller " + error)
        res.status(500).json({ 
          success: false,
          message: "Error email application", 
          error: error.message 
      });
      }

      res.status(201).json({ 
          success: true,
          message: "Application submitted successfully",
          applicationID: applicationID
      });

  } catch (error) {
      console.error("Application submission error:", error);
      res.status(500).json({ 
          success: false,
          message: "Error submitting application", 
          error: error.message 
      });
  }
};



