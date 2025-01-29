import Survey from '../models/surveyModel.js';

// 獲取案件的所有勘查資訊
export const getSurveysByCaseId = async (req, res) => {
  try {
    const surveys = await Survey.find({ caseId: req.params.caseId });
    res.json(surveys);
  } catch (error) {
    res
      .status(500)
      .json({ message: '獲取勘查資訊列表失敗', error: error.message });
  }
};

// 創建新勘查資訊
export const createSurvey = async (req, res) => {
  try {
    const newSurvey = new Survey({
      ...req.body,
      caseId: req.params.caseId,
    });
    await newSurvey.save();
    res.status(201).json(newSurvey);
  } catch (error) {
    res.status(400).json({ message: '創建勘查資訊失敗', error: error.message });
  }
};

// 更新勘查資訊
export const updateSurvey = async (req, res) => {
  try {
    const updatedSurvey = await Survey.findByIdAndUpdate(
      req.params.surveyId,
      req.body,
      { new: true },
    );
    if (!updatedSurvey) {
      return res.status(404).json({ message: '找不到該勘查資訊' });
    }
    res.json(updatedSurvey);
  } catch (error) {
    res.status(400).json({ message: '更新勘查資訊失敗', error: error.message });
  }
};

// 刪除勘查資訊
export const deleteSurvey = async (req, res) => {
  try {
    const deletedSurvey = await Survey.findByIdAndDelete(req.params.surveyId);
    if (!deletedSurvey) {
      return res.status(404).json({ message: '找不到該勘查資訊' });
    }
    res.json({ message: '勘查資訊已刪除' });
  } catch (error) {
    res.status(500).json({ message: '刪除勘查資訊失敗', error: error.message });
  }
};
