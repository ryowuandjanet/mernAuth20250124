import FinalDecision from '../models/finalDecisionModel.js';

// 獲取案件的所有最終判定
export const getFinalDecisionsByCaseId = async (req, res) => {
  try {
    console.log('Getting final decisions for case:', req.params.caseId);
    const finalDecisions = await FinalDecision.find({
      caseId: req.params.caseId,
    });
    console.log('Found final decisions:', finalDecisions);
    res.json(finalDecisions);
  } catch (error) {
    res
      .status(500)
      .json({ message: '獲取最終判定列表失敗', error: error.message });
  }
};

// 創建新最終判定
export const createFinalDecision = async (req, res) => {
  try {
    const newFinalDecision = new FinalDecision({
      ...req.body,
      caseId: req.params.caseId,
    });
    await newFinalDecision.save();
    res.status(201).json(newFinalDecision);
  } catch (error) {
    res.status(400).json({ message: '創建最終判定失敗', error: error.message });
  }
};

// 更新最終判定
export const updateFinalDecision = async (req, res) => {
  try {
    const updatedFinalDecision = await FinalDecision.findByIdAndUpdate(
      req.params.finalDecisionId,
      req.body,
      { new: true },
    );
    if (!updatedFinalDecision) {
      return res.status(404).json({ message: '找不到該最終判定' });
    }
    res.json(updatedFinalDecision);
  } catch (error) {
    res.status(400).json({ message: '更新最終判定失敗', error: error.message });
  }
};

// 刪除最終判定
export const deleteFinalDecision = async (req, res) => {
  try {
    const deletedFinalDecision = await FinalDecision.findByIdAndDelete(
      req.params.finalDecisionId,
    );
    if (!deletedFinalDecision) {
      return res.status(404).json({ message: '找不到該最終判定' });
    }
    res.json({ message: '最終判定已刪除' });
  } catch (error) {
    res.status(500).json({ message: '刪除最終判定失敗', error: error.message });
  }
};
