import Person from '../models/personModel.js';

// 獲取案件的所有人員
export const getPersonsByCaseId = async (req, res) => {
  try {
    const persons = await Person.find({ caseId: req.params.caseId });
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: '獲取人員列表失敗', error: error.message });
  }
};

// 創建新人員
export const createPerson = async (req, res) => {
  try {
    const newPerson = new Person({
      ...req.body,
      caseId: req.params.caseId,
    });
    await newPerson.save();
    res.status(201).json(newPerson);
  } catch (error) {
    res.status(400).json({ message: '創建人員失敗', error: error.message });
  }
};

// 更新人員
export const updatePerson = async (req, res) => {
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.personId,
      { ...req.body, updatedAt: Date.now() },
      { new: true },
    );
    if (!updatedPerson) {
      return res.status(404).json({ message: '找不到該人員' });
    }
    res.json(updatedPerson);
  } catch (error) {
    res.status(400).json({ message: '更新人員失敗', error: error.message });
  }
};

// 刪除人員
export const deletePerson = async (req, res) => {
  try {
    const deletedPerson = await Person.findByIdAndDelete(req.params.personId);
    if (!deletedPerson) {
      return res.status(404).json({ message: '找不到該人員' });
    }
    res.json({ message: '人員已刪除' });
  } catch (error) {
    res.status(500).json({ message: '刪除人員失敗', error: error.message });
  }
};
