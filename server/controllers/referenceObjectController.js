import ReferenceObject from '../models/referenceObjectModel.js';

// 獲取特定案件的所有參考物件
export const getReferenceObjects = async (req, res) => {
  try {
    const referenceObjects = await ReferenceObject.find({
      caseId: req.params.caseId,
    });
    res.json(referenceObjects);
  } catch (error) {
    res.status(500).json({ message: '獲取參考物件失敗', error: error.message });
  }
};

// 創建新的參考物件
export const createReferenceObject = async (req, res) => {
  try {
    const newReferenceObject = new ReferenceObject({
      caseId: req.params.caseId,
      ...req.body,
    });
    const savedReferenceObject = await newReferenceObject.save();
    res.status(201).json(savedReferenceObject);
  } catch (error) {
    res.status(400).json({ message: '創建參考物件失敗', error: error.message });
  }
};

// 更新參考物件
export const updateReferenceObject = async (req, res) => {
  try {
    const updatedReferenceObject = await ReferenceObject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedReferenceObject) {
      return res.status(404).json({ message: '找不到該參考物件' });
    }
    res.json(updatedReferenceObject);
  } catch (error) {
    res.status(400).json({ message: '更新參考物件失敗', error: error.message });
  }
};

// 刪除參考物件
export const deleteReferenceObject = async (req, res) => {
  try {
    const deletedReferenceObject = await ReferenceObject.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedReferenceObject) {
      return res.status(404).json({ message: '找不到該參考物件' });
    }
    res.json({ message: '參考物件已成功刪除' });
  } catch (error) {
    res.status(500).json({ message: '刪除參考物件失敗', error: error.message });
  }
};

// 新增評分
export const addScore = async (req, res) => {
  try {
    const referenceObject = await ReferenceObject.findById(req.params.id);
    if (!referenceObject) {
      return res.status(404).json({ message: '找不到該參考物件' });
    }

    referenceObject.scores.push(req.body);
    const updatedReferenceObject = await referenceObject.save();
    res.json(updatedReferenceObject);
  } catch (error) {
    res.status(400).json({ message: '新增評分失敗', error: error.message });
  }
};

// 更新評分
export const updateScore = async (req, res) => {
  try {
    const referenceObject = await ReferenceObject.findById(req.params.id);
    if (!referenceObject) {
      return res.status(404).json({ message: '找不到該參考物件' });
    }

    const scoreIndex = referenceObject.scores.findIndex(
      (score) => score._id.toString() === req.params.scoreId,
    );

    if (scoreIndex === -1) {
      return res.status(404).json({ message: '找不到該評分' });
    }

    referenceObject.scores[scoreIndex] = {
      ...referenceObject.scores[scoreIndex],
      ...req.body,
    };

    // 保存並返回更新後的文檔
    const updatedReferenceObject = await referenceObject.save();

    // 確保返回完整的更新後數據
    const refreshedObject = await ReferenceObject.findById(
      updatedReferenceObject._id,
    );
    res.json(refreshedObject);
  } catch (error) {
    res.status(400).json({ message: '更新評分失敗', error: error.message });
  }
};

// 刪除評分
export const deleteScore = async (req, res) => {
  try {
    const referenceObject = await ReferenceObject.findById(req.params.id);
    if (!referenceObject) {
      return res.status(404).json({ message: '找不到該參考物件' });
    }

    referenceObject.scores = referenceObject.scores.filter(
      (score) => score._id.toString() !== req.params.scoreId,
    );

    const updatedReferenceObject = await referenceObject.save();
    res.json(updatedReferenceObject);
  } catch (error) {
    res.status(400).json({ message: '刪除評分失敗', error: error.message });
  }
};
