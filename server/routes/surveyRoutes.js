import express from 'express';
import {
  getSurveysByCaseId,
  createSurvey,
  updateSurvey,
  deleteSurvey,
} from '../controllers/surveyController.js';

const router = express.Router();

router.get('/case/:caseId/surveys', getSurveysByCaseId);
router.post('/case/:caseId/surveys', createSurvey);
router.put('/surveys/:surveyId', updateSurvey);
router.delete('/surveys/:surveyId', deleteSurvey);

export default router;
