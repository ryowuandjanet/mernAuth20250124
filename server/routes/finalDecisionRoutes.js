import express from 'express';
import {
  getFinalDecisionsByCaseId,
  createFinalDecision,
  updateFinalDecision,
  deleteFinalDecision,
} from '../controllers/finalDecisionController.js';

const router = express.Router();

router.get('/case/:caseId/finalDecisions', getFinalDecisionsByCaseId);
router.post('/case/:caseId/finalDecisions', createFinalDecision);
router.put('/finalDecisions/:finalDecisionId', updateFinalDecision);
router.delete('/finalDecisions/:finalDecisionId', deleteFinalDecision);

export default router;
