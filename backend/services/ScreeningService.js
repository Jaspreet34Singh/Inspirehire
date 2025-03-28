import Application from '../modules/application.model.js';
import JobPost from '../modules/job.model.js';
import ScreeningCalculator from '../utils/screeningCalculator.js';

class ScreeningService {
  /**
   * Perform screening for an application
   * @param {number} applicationId 
   * @returns {Object} Screening result
   */
  static async performScreening(applicationId) {
    try {
      // Fetch application with associated job post
      const application = await Application.findOne({
        where: { Application_ID: applicationId },
        include: [{
          model: JobPost,
          attributes: ['MinFieldRelatedExp', 'MinEducationLevel']
        }]
      });

      if (!application) {
        throw new Error('Application not found');
      }

      // Prepare screening data
      const screeningData = {
        MinFieldRelatedExp: application.JobPost.MinFieldRelatedExp,
        ApplicantFieldRelatedExp: application.FieldRelatedExp,
        ApplicantOffFieldExpTier: application.OffFieldExp,
        MinEducationLevel: application.JobPost.MinEducationLevel,
        ApplicantEducationLevel: application.EducationExp // Fixed typo here (removed extra space)
      };

      // Calculate screening result
      const screeningResult = ScreeningCalculator.calculateScreening(screeningData);
      console.log(screeningResult);

      // Update application with screening results
      await application.update({
        ScreeningDetails: screeningResult.ScreeningDetails
      });

      return {
        ...screeningResult,
        jobDetails: {
          minFieldRelatedExp: application.JobPost.MinFieldRelatedExp,
          minEducationLevel: application.JobPost.MinEducationLevel
        }
      };
    } catch (error) {
      console.error('Screening process error:', error);
      throw error;
    }
  }
}

export default ScreeningService;