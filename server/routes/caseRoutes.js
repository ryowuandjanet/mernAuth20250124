import express from 'express';
import {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
  searchCases,
  filterCasesByStatus,
  getCaseStats,
} from '../controllers/caseController.js';

const router = express.Router();

// 基本 CRUD 路由
router.get('/', getCases);
router.get('/:id', getCaseById);
router.post('/', createCase);
router.put('/:id', updateCase);
router.delete('/:id', deleteCase);

// 搜索和篩選路由
router.get('/search', searchCases);
router.get('/filter/:status', filterCasesByStatus);
router.get('/stats', getCaseStats);

export default router;
