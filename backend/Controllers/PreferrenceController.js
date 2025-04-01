import JobPreference from '../modules/jobPreference.model.js';
import WorkExp from '../modules/workExp.model.js';
import User from '../modules/userModule.js';
import Education from '../modules/education.model.js';

// Save job preference
export const saveJobPreference = async (req, res) => {
  try {
    const { USER_ID, Category_ID, JobType, JobLocation } = req.body;
    
    const jobPreference = await JobPreference.create({
      USER_ID,
      Category_ID,
      JobType,
      JobLocation
    });
    
    res.status(201).json(jobPreference);
  } catch (error) {
    console.error('Error saving job preference:', error);
    res.status(500).json({ message: 'Failed to save job preference' });
  }
};

// Save education details
export const saveEducation = async (req, res) => {
    try {
      const { USER_ID, Degree, Start_Date, End_Date, InstitutionName, Field_Of_Study } = req.body;
      
      const education = await Education.create({
        USER_ID,
        Degree,
        Start_Date,
        End_Date,
        InstitutionName,
        Field_Of_Study
      });
      
      res.status(201).json(education);
    } catch (error) {
      console.error('Error saving education details:', error);
      res.status(500).json({ message: 'Failed to save education details' });
    }
  };

// Save work experience
export const saveWorkExperience = async (req, res) => {
    try {
      const { USER_ID, workExperience } = req.body; // Expecting an array of work experiences
        console.log(req.body)
        console.log(USER_ID)
        console.log(workExperience)
      if (!workExperience || workExperience.length === 0) {
        return res.status(400).json({ message: "No work experience provided" });
      }
  
      // Map each work experience entry and insert into the database
      const workExpRecords = await Promise.all(
        workExperience.map(async (exp) => {
          return await WorkExp.create({
            USER_ID,
            Job_Title: exp.jobTitle,
            CompanyName: exp.companyName,
            JobDescription: exp.jobDescription,
            StartDate: exp.startDate, 
            EndDate: exp.endDate || null, // Optional
          });
        })
      );
  
      res.status(201).json(workExpRecords);
    } catch (error) {
      console.error("Error saving work experience:", error);
      res.status(500).json({ message: "Failed to save work experience" });
    }
  };

// Update user's first login status
export const updateFirstLogin = async (req, res) => {
  try {
    const { id } = req.params;
    const { First_Login } = req.body;
    
    await User.update(
      { First_Login },
      { where: { User_ID: id } }
    );
    
    res.status(200).json({ message: 'First login status updated successfully' });
  } catch (error) {
    console.error('Error updating first login status:', error);
    res.status(500).json({ message: 'Failed to update first login status' });
  }
};