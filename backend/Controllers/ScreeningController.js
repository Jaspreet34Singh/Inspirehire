import ScreeningService from '../services/ScreeningService.js';

class ScreeningController {
  /**
   * Perform screening for a single application
   */
  static async screenApplication(req, res) {
    try {
      const { applicationId } = req.params;
      
      const screeningResult = await ScreeningService.performScreening(applicationId);
      
      res.json({
        success: true,
        screeningResult
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Screening process failed',
        error: error.message
      });
    }
  }

  
}

export default ScreeningController;