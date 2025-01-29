import ActionResult from '../models/actionResultModel.js';

// 獲取案件的所有執行結果
export const getActionResultsByCaseId = async (req, res) => {
  try {
    console.log('Getting action results for case:', req.params.caseId);
    const actionResults = await ActionResult.find({
      caseId: req.params.caseId,
    });
    console.log('Found action results:', actionResults);
    res.json(actionResults);
  } catch (error) {
    res
      .status(500)
      .json({ message: '獲取執行結果列表失敗', error: error.message });
  }
};

// 創建新執行結果
export const createActionResult = async (req, res) => {
  try {
    const newActionResult = new ActionResult({
      ...req.body,
      caseId: req.params.caseId,
    });
    await newActionResult.save();
    res.status(201).json(newActionResult);
  } catch (error) {
    res.status(400).json({ message: '創建執行結果失敗', error: error.message });
  }
};

// 更新執行結果
export const updateActionResult = async (req, res) => {
  try {
    const updatedActionResult = await ActionResult.findByIdAndUpdate(
      req.params.actionResultId,
      req.body,
      { new: true },
    );
    if (!updatedActionResult) {
      return res.status(404).json({ message: '找不到該執行結果' });
    }
    res.json(updatedActionResult);
  } catch (error) {
    res.status(400).json({ message: '更新執行結果失敗', error: error.message });
  }
};

// 刪除執行結果
export const deleteActionResult = async (req, res) => {
  try {
    const deletedActionResult = await ActionResult.findByIdAndDelete(
      req.params.actionResultId,
    );
    if (!deletedActionResult) {
      return res.status(404).json({ message: '找不到該執行結果' });
    }
    res.json({ message: '執行結果已刪除' });
  } catch (error) {
    res.status(500).json({ message: '刪除執行結果失敗', error: error.message });
  }
};
