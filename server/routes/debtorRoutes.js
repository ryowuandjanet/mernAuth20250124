import express from 'express';
import {
  getDebtorsByCaseId,
  createDebtor,
  updateDebtor,
  deleteDebtor,
} from '../controllers/debtorController.js';

const router = express.Router();

router.get('/case/:caseId/debtors', getDebtorsByCaseId);
router.post('/case/:caseId/debtors', createDebtor);
router.put('/debtors/:debtorId', updateDebtor);
router.delete('/debtors/:debtorId', deleteDebtor);

export default router;
