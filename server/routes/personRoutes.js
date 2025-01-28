import express from 'express';
import {
  getPersonsByCaseId,
  createPerson,
  updatePerson,
  deletePerson,
} from '../controllers/personController.js';

const router = express.Router();

router.get('/case/:caseId/persons', getPersonsByCaseId);
router.post('/case/:caseId/persons', createPerson);
router.put('/persons/:personId', updatePerson);
router.delete('/persons/:personId', deletePerson);

export default router;
