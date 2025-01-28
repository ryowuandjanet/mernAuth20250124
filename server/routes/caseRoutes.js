import express from 'express';
import {
  getAllCases,
  getCase,
  createCase,
  updateCase,
  deleteCase,
} from '../controllers/caseController.js';

const router = express.Router();

router.get('/', getAllCases);
router.get('/:id', getCase);
router.post('/', createCase);
router.put('/:id', updateCase);
router.delete('/:id', deleteCase);

export default router;
