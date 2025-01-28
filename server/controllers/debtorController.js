import Debtor from '../models/debtorModel.js';

// 獲取案件的所有債務人
export const getDebtorsByCaseId = async (req, res) => {
  try {
    const debtors = await Debtor.find({ caseId: req.params.caseId });
    res.json(debtors);
  } catch (error) {
    res
      .status(500)
      .json({ message: '獲取債務人列表失敗', error: error.message });
  }
};

// 創建新債務人
export const createDebtor = async (req, res) => {
  try {
    const newDebtor = new Debtor({
      ...req.body,
      caseId: req.params.caseId,
    });
    await newDebtor.save();
    res.status(201).json(newDebtor);
  } catch (error) {
    res.status(400).json({ message: '創建債務人失敗', error: error.message });
  }
};

// 更新債務人
export const updateDebtor = async (req, res) => {
  try {
    const updatedDebtor = await Debtor.findByIdAndUpdate(
      req.params.debtorId,
      { ...req.body, updatedAt: Date.now() },
      { new: true },
    );
    if (!updatedDebtor) {
      return res.status(404).json({ message: '找不到該債務人' });
    }
    res.json(updatedDebtor);
  } catch (error) {
    res.status(400).json({ message: '更新債務人失敗', error: error.message });
  }
};

// 刪除債務人
export const deleteDebtor = async (req, res) => {
  try {
    const deletedDebtor = await Debtor.findByIdAndDelete(req.params.debtorId);
    if (!deletedDebtor) {
      return res.status(404).json({ message: '找不到該債務人' });
    }
    res.json({ message: '債務人已刪除' });
  } catch (error) {
    res.status(500).json({ message: '刪除債務人失敗', error: error.message });
  }
};
