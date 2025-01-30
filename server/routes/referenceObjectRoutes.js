import express from 'express';
import {
  getReferenceObjects,
  createReferenceObject,
  updateReferenceObject,
  deleteReferenceObject,
} from '../controllers/referenceObjectController.js';

const router = express.Router();

// 獲取特定案件的所有參考物件
router.get('/case/:caseId/referenceObjects', getReferenceObjects);

// 為特定案件創建新的參考物件
router.post('/case/:caseId/referenceObjects', createReferenceObject);

// 更新特定參考物件
router.put('/referenceObjects/:id', updateReferenceObject);

// 刪除特定參考物件
router.delete('/referenceObjects/:id', deleteReferenceObject);

export default router;
// 或使用 CommonJS 語法：
// module.exports = router;
