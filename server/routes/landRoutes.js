import express from 'express';
import {
  getLandsByCaseId,
  createLand,
  updateLand,
  deleteLand,
} from '../controllers/landController.js';

const router = express.Router();

router.get('/case/:caseId/lands', getLandsByCaseId);
router.post('/case/:caseId/lands', createLand);
router.put('/lands/:landId', updateLand);
router.delete('/lands/:landId', deleteLand);

export default router;
