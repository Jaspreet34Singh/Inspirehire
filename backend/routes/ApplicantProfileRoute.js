// userRoutes.js
import express from 'express';
import User from '../modules/userModule.js';
import Education from '../modules/education.model.js';
import WorkExp from '../modules/workExp.model.js';
import JobPreference from '../modules/jobPreference.model.js';
import JobCategory from '../modules/jobCategory.model.js';

const router = express.Router();

// Get user data
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId, {
      attributes: ['User_ID', 'Name', 'Email', 'phone', 'DateOfBirth', 'Image',"WorkingID"]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user education data
router.get('/:userId/education', async (req, res) => {
  try {
    const { userId } = req.params;
    const education = await Education.findAll({
      where: { USER_ID: userId },
      order: [['Start_Date', 'DESC']]
    });

    res.json(education);
  } catch (error) {
    console.error('Error fetching education:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user work experience data
router.get('/:userId/workexp', async (req, res) => {
  try {
    const { userId } = req.params;
    const workExp = await WorkExp.findAll({
      where: { USER_ID: userId },
      order: [['StartDate', 'DESC']]
    });

    res.json(workExp);
  } catch (error) {
    console.error('Error fetching work experience:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user job preferences with category names
router.get('/:userId/preferences', async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await JobPreference.findAll({
      where: { USER_ID: userId },
      include: [{
        model: JobCategory,
        attributes: ['Category_Name']
      }]
    });

    // Format the response to include category name directly
    const formattedPreferences = preferences.map(pref => ({
      JobPref_ID: pref.JobPref_ID,
      USER_ID: pref.USER_ID,
      Category_ID: pref.Category_ID,
      categoryName: pref.JobCategory.Category_Name,
      JobType: pref.JobType,
      JobLocation: pref.JobLocation
    }));

    res.json(formattedPreferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/update/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { Name, Email, phone, DateOfBirth, WorkingID } = req.body;

    if (!Name || !Email || !phone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedFields = {
      Name,
      Email,
      phone,
      DateOfBirth
    };

    // Only allow HR to update WorkingID
    if (user.Role_ID === 2 && WorkingID) {
      updatedFields.WorkingID = WorkingID;
    }

    await user.update(updatedFields);

    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update user profile' });
  }
});

// Update education details
router.put('/:userId/education/:eduId', async (req, res) => {
  try {
    const { userId, eduId } = req.params;
    const { Degree, Start_Date, End_Date, InstitutionName, Field_Of_Study } = req.body;
    
    // Validate input
    if (!Degree || !Start_Date || !InstitutionName || !Field_Of_Study) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Find the education record
    const eduRecord = await Education.findOne({
      where: {
        EduDetail_ID: eduId,
        USER_ID: userId
      }
    });
    
    if (!eduRecord) {
      return res.status(404).json({ message: 'Education record not found' });
    }
    
    // Update education details
    await eduRecord.update({
      Degree,
      Start_Date,
      End_Date,
      InstitutionName,
      Field_Of_Study
    });
    
    res.status(200).json({ message: 'Education details updated successfully' });
  } catch (error) {
    console.error('Error updating education details:', error);
    res.status(500).json({ message: 'Failed to update education details' });
  }
});

// Create education record
router.post('/education', async (req, res) => {
  try {
    const { USER_ID, Degree, Start_Date, End_Date, InstitutionName, Field_Of_Study } = req.body;
    
    // Validate input
    if (!USER_ID || !Degree || !Start_Date || !InstitutionName || !Field_Of_Study) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create education record
    const newEducation = await Education.create({
      USER_ID,
      Degree,
      Start_Date,
      End_Date,
      InstitutionName,
      Field_Of_Study
    });
    
    res.status(201).json({ 
      message: 'Education record created successfully',
      eduId: newEducation.EduDetail_ID
    });
  } catch (error) {
    console.error('Error creating education record:', error);
    res.status(500).json({ message: 'Failed to create education record' });
  }
});

// Update job preference
router.put('/:userId/preferences/:prefId', async (req, res) => {
  try {
    const { userId, prefId } = req.params;
    const { Category_ID, JobType, JobLocation } = req.body;
    
    // Validate input
    if (!Category_ID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Find the preference record
    const prefRecord = await JobPreference.findOne({
      where: {
        JobPref_ID: prefId,
        USER_ID: userId
      }
    });
    
    if (!prefRecord) {
      return res.status(404).json({ message: 'Job preference record not found' });
    }
    
    // Update preference
    await prefRecord.update({
      Category_ID,
      JobType,
      JobLocation
    });
    
    res.status(200).json({ message: 'Job preference updated successfully' });
  } catch (error) {
    console.error('Error updating job preference:', error);
    res.status(500).json({ message: 'Failed to update job preference' });
  }
});

// Create job preference
router.post('/job-preferences', async (req, res) => {
  try {
    const { USER_ID, Category_ID, JobType, JobLocation } = req.body;
    
    // Validate input
    if (!USER_ID || !Category_ID) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create job preference
    const newPreference = await JobPreference.create({
      USER_ID,
      Category_ID,
      JobType: JobType || 'Full-time',
      JobLocation: JobLocation || 'Remote'
    });
    
    res.status(201).json({ 
      message: 'Job preference created successfully',
      prefId: newPreference.JobPref_ID
    });
  } catch (error) {
    console.error('Error creating job preference:', error);
    res.status(500).json({ message: 'Failed to create job preference' });
  }
});

// Delete job preference
router.delete('/:userId/preferences/:prefId', async (req, res) => {
  try {
    const { userId, prefId } = req.params;
    
    // Find the preference record
    const prefRecord = await JobPreference.findOne({
      where: {
        JobPref_ID: prefId,
        USER_ID: userId
      }
    });
    
    if (!prefRecord) {
      return res.status(404).json({ message: 'Job preference record not found' });
    }
    
    // Delete preference
    await prefRecord.destroy();
    
    res.status(200).json({ message: 'Job preference deleted successfully' });
  } catch (error) {
    console.error('Error deleting job preference:', error);
    res.status(500).json({ message: 'Failed to delete job preference' });
  }
});

// Update work experience
router.put('/:userId/workexp/:workExpId', async (req, res) => {
  try {
    const { userId, workExpId } = req.params;
    const { Job_Title, CompanyName, JobDescription, StartDate, EndDate } = req.body;
    
    // Validate input
    if (!Job_Title || !CompanyName || !JobDescription || !StartDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Find the work experience record
    const workExpRecord = await WorkExp.findOne({
      where: {
        WorkExp_ID: workExpId,
        USER_ID: userId
      }
    });
    
    if (!workExpRecord) {
      return res.status(404).json({ message: 'Work experience record not found' });
    }
    
    // Update work experience
    await workExpRecord.update({
      Job_Title,
      CompanyName,
      JobDescription,
      StartDate,
      EndDate
    });
    
    res.status(200).json({ message: 'Work experience updated successfully' });
  } catch (error) {
    console.error('Error updating work experience:', error);
    res.status(500).json({ message: 'Failed to update work experience' });
  }
});

// Create work experience
router.post('/work-experience', async (req, res) => {
  try {
    const { USER_ID, workExperience } = req.body;
    
    if (!USER_ID || !workExperience || !Array.isArray(workExperience) || workExperience.length === 0) {
      return res.status(400).json({ message: 'Invalid input format' });
    }
    
    const createdIds = [];
    
    // Insert each work experience record
    for (const exp of workExperience) {
      const { jobTitle, companyName, jobDescription, startDate, endDate } = exp;
      
      // Validate each work experience object
      if (!jobTitle || !companyName || !jobDescription || !startDate) {
        return res.status(400).json({ message: 'Missing required fields in work experience' });
      }
      
      // Create work experience
      const newWorkExp = await WorkExp.create({
        USER_ID,
        Job_Title: jobTitle,
        CompanyName: companyName,
        JobDescription: jobDescription,
        StartDate: startDate,
        EndDate: endDate
      });
      
      createdIds.push(newWorkExp.WorkExp_ID);
    }
    
    res.status(201).json({ 
      message: 'Work experience records created successfully',
      workExpIds: createdIds
    });
  } catch (error) {
    console.error('Error creating work experience records:', error);
    res.status(500).json({ message: 'Failed to create work experience records' });
  }
});

// Delete work experience
router.delete('/:userId/workexp/:workExpId', async (req, res) => {
  try {
    const { userId, workExpId } = req.params;
    
    // Find the work experience record
    const workExpRecord = await WorkExp.findOne({
      where: {
        WorkExp_ID: workExpId,
        USER_ID: userId
      }
    });
    
    if (!workExpRecord) {
      return res.status(404).json({ message: 'Work experience record not found' });
    }
    
    // Delete work experience
    await workExpRecord.destroy();
    
    res.status(200).json({ message: 'Work experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting work experience:', error);
    res.status(500).json({ message: 'Failed to delete work experience' });
  }
});

export default router;