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
      attributes: ['User_ID', 'Name', 'Email', 'phone', 'DateOfBirth', 'Image']
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

export default router;