import express from 'express';
import {
  getBuildsByCaseId,
  createBuild,
  updateBuild,
  deleteBuild,
} from '../controllers/buildController.js';

const router = express.Router();

router.get('/case/:caseId/builds', getBuildsByCaseId);
router.post('/case/:caseId/builds', createBuild);
router.put('/builds/:buildId', updateBuild);
router.delete('/builds/:buildId', deleteBuild);

export default router;
