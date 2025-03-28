
import express from 'express';
import ScreeningController from '../Controllers/ScreeningController.js';

const screeningRouter = express.Router();

// Screen a single application
screeningRouter.post('/:applicationId/screen', 
  ScreeningController.screenApplication
);



export default screeningRouter;