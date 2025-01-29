import express from 'express';
import {
  getActionResultsByCaseId,
  createActionResult,
  updateActionResult,
  deleteActionResult,
} from '../controllers/actionResultController.js';

const router = express.Router();

router.get('/case/:caseId/actionResults', getActionResultsByCaseId);
router.post('/case/:caseId/actionResults', createActionResult);
router.put('/actionResults/:actionResultId', updateActionResult);
router.delete('/actionResults/:actionResultId', deleteActionResult);

export default router;
