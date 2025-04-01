import express from 'express';
import { 
  saveEducation,
  saveJobPreference, 
  saveWorkExperience, 
  updateFirstLogin 
} from '../Controllers/PreferrenceController.js';

const router = express.Router();



// Save education details
router.post('/education', saveEducation);

// Save job preference
router.post('/job-preferences', saveJobPreference);

// Save work experience
router.post('/work-experience', saveWorkExperience);

// Update user's first login status
router.put('/users/:id/update-first-login', updateFirstLogin);

export default router;