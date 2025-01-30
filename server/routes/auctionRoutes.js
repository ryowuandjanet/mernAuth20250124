import express from 'express';
import {
  getAuctions,
  createAuction,
  updateAuction,
  deleteAuction,
} from '../controllers/auctionController.js';

const router = express.Router();

// 獲取特定案件的所有拍賣資訊
router.get('/case/:caseId/auctions', getAuctions);

// 為特定案件創建新的拍賣資訊
router.post('/case/:caseId/auctions', createAuction);

// 更新特定拍賣資訊
router.put('/auctions/:id', updateAuction);

// 刪除特定拍賣資訊
router.delete('/auctions/:id', deleteAuction);

export default router;
