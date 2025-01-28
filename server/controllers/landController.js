import Land from '../models/landModel.js';

// 獲取案件的所有土地資訊
export const getLandsByCaseId = async (req, res) => {
  try {
    const lands = await Land.find({ caseId: req.params.caseId });
    res.json(lands);
  } catch (error) {
    res
      .status(500)
      .json({ message: '獲取土地資訊列表失敗', error: error.message });
  }
};

// 創建新土地資訊
export const createLand = async (req, res) => {
  try {
    const newLand = new Land({
      ...req.body,
      caseId: req.params.caseId,
      landUpdated: new Date(),
    });
    await newLand.save();
    res.status(201).json(newLand);
  } catch (error) {
    res.status(400).json({ message: '創建土地資訊失敗', error: error.message });
  }
};

// 更新土地資訊
export const updateLand = async (req, res) => {
  try {
    const updatedLand = await Land.findByIdAndUpdate(
      req.params.landId,
      {
        ...req.body,
        landUpdated: new Date(),
      },
      { new: true },
    );
    if (!updatedLand) {
      return res.status(404).json({ message: '找不到該土地資訊' });
    }
    res.json(updatedLand);
  } catch (error) {
    res.status(400).json({ message: '更新土地資訊失敗', error: error.message });
  }
};

// 刪除土地資訊
export const deleteLand = async (req, res) => {
  try {
    const deletedLand = await Land.findByIdAndDelete(req.params.landId);
    if (!deletedLand) {
      return res.status(404).json({ message: '找不到該土地資訊' });
    }
    res.json({ message: '土地資訊已刪除' });
  } catch (error) {
    res.status(500).json({ message: '刪除土地資訊失敗', error: error.message });
  }
};
