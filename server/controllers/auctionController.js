import Auction from '../models/auctionModel.js';

// 獲取特定案件的所有拍賣資訊
export const getAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ caseId: req.params.caseId }).sort({
      auctionDate: 1,
    });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: '獲取拍賣資訊失敗', error: error.message });
  }
};

// 創建新的拍賣資訊
export const createAuction = async (req, res) => {
  try {
    const newAuction = new Auction({
      caseId: req.params.caseId,
      ...req.body,
    });
    const savedAuction = await newAuction.save();
    res.status(201).json(savedAuction);
  } catch (error) {
    res.status(400).json({ message: '創建拍賣資訊失敗', error: error.message });
  }
};

// 更新拍賣資訊
export const updateAuction = async (req, res) => {
  try {
    const updatedAuction = await Auction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedAuction) {
      return res.status(404).json({ message: '找不到該拍賣資訊' });
    }
    res.json(updatedAuction);
  } catch (error) {
    res.status(400).json({ message: '更新拍賣資訊失敗', error: error.message });
  }
};

// 刪除拍賣資訊
export const deleteAuction = async (req, res) => {
  try {
    const deletedAuction = await Auction.findByIdAndDelete(req.params.id);
    if (!deletedAuction) {
      return res.status(404).json({ message: '找不到該拍賣資訊' });
    }
    res.json({ message: '拍賣資訊已成功刪除' });
  } catch (error) {
    res.status(500).json({ message: '刪除拍賣資訊失敗', error: error.message });
  }
};
