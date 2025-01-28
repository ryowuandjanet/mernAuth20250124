import Case from '../models/caseModel.js';

// 獲取所有案件
export const getAllCases = async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: '獲取案件列表失敗', error: error.message });
  }
};

// 獲取單個案件
export const getCase = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ message: '找不到該案件' });
    }
    res.json(caseItem);
  } catch (error) {
    console.error('Error in getCase:', error);
    res.status(500).json({ message: '獲取案件失敗', error: error.message });
  }
};

// 創建新案件
export const createCase = async (req, res) => {
  try {
    const newCase = new Case(req.body);
    await newCase.save();
    res.status(201).json(newCase);
  } catch (error) {
    res.status(400).json({ message: '創建案件失敗', error: error.message });
  }
};

// 更新案件
export const updateCase = async (req, res) => {
  try {
    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true },
    );
    if (!updatedCase) {
      return res.status(404).json({ message: '找不到該案件' });
    }
    res.json(updatedCase);
  } catch (error) {
    res.status(400).json({ message: '更新案件失敗', error: error.message });
  }
};

// 刪除案件
export const deleteCase = async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) {
      return res.status(404).json({ message: '找不到該案件' });
    }
    res.json({ message: '案件已刪除' });
  } catch (error) {
    res.status(500).json({ message: '刪除案件失敗', error: error.message });
  }
};
