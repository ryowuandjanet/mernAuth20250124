import Build from '../models/buildModel.js';

// 獲取案件的所有建物資訊
export const getBuildsByCaseId = async (req, res) => {
  try {
    const builds = await Build.find({ caseId: req.params.caseId });
    res.json(builds);
  } catch (error) {
    res
      .status(500)
      .json({ message: '獲取建物資訊列表失敗', error: error.message });
  }
};

// 創建新建物資訊
export const createBuild = async (req, res) => {
  try {
    const newBuild = new Build({
      ...req.body,
      caseId: req.params.caseId,
      buildUpdated: new Date(),
    });
    await newBuild.save();
    res.status(201).json(newBuild);
  } catch (error) {
    res.status(400).json({ message: '創建建物資訊失敗', error: error.message });
  }
};

// 更新建物資訊
export const updateBuild = async (req, res) => {
  try {
    const updatedBuild = await Build.findByIdAndUpdate(
      req.params.buildId,
      {
        ...req.body,
        buildUpdated: new Date(),
      },
      { new: true },
    );
    if (!updatedBuild) {
      return res.status(404).json({ message: '找不到該建物資訊' });
    }
    res.json(updatedBuild);
  } catch (error) {
    res.status(400).json({ message: '更新建物資訊失敗', error: error.message });
  }
};

// 刪除建物資訊
export const deleteBuild = async (req, res) => {
  try {
    const deletedBuild = await Build.findByIdAndDelete(req.params.buildId);
    if (!deletedBuild) {
      return res.status(404).json({ message: '找不到該建物資訊' });
    }
    res.json({ message: '建物資訊已刪除' });
  } catch (error) {
    res.status(500).json({ message: '刪除建物資訊失敗', error: error.message });
  }
};
