import Case from '../models/caseModel.js';

// 獲取所有案件
export const getCases = async (req, res) => {
  try {
    // 使用 find() 獲取所有案件，並按創建時間降序排序
    const cases = await Case.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email'); // 如果需要關聯用戶信息

    // 如果沒有找到案件
    if (cases.length === 0) {
      return res.status(200).json({ message: '目前沒有案件', cases: [] });
    }

    // 返回所有案件
    res.json({
      count: cases.length,
      cases: cases,
    });
  } catch (error) {
    console.error('Get cases error:', error);
    res.status(500).json({ message: '獲取案件失敗' });
  }
};

// 獲取單個案件
export const getCaseById = async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ message: '案件不存在' });
    }
    res.json(caseItem);
  } catch (error) {
    console.error('Get case by id error:', error);
    res.status(500).json({ message: '獲取案件失敗' });
  }
};

// 創建新案件
export const createCase = async (req, res) => {
  try {
    console.log('Creating new case with data:', req.body);

    const caseData = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || 'pending',
      priority: req.body.priority || 'medium',
      category: req.body.category,
      assignedTo: req.body.assignedTo,
      dueDate: req.body.dueDate,
      location: req.body.location,
      budget: req.body.budget,
      contactInfo: {
        name: req.body.contactInfo?.name,
        phone: req.body.contactInfo?.phone,
        email: req.body.contactInfo?.email,
      },
      tags: req.body.tags || [],
      attachments: req.body.attachments || [],
      comments: req.body.comments || [],
      progress: req.body.progress || 0,
    };

    const newCase = await Case.create(caseData);

    console.log('Case created successfully:', newCase);

    res.status(201).json({
      message: '案件創建成功',
      case: newCase,
    });
  } catch (error) {
    console.error('Create case error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      console.log('Validation errors:', errors);
      return res.status(400).json({
        message: '請填寫必要欄位',
        errors: errors,
      });
    }

    res.status(500).json({
      message: '創建案件失敗',
      error: error.message,
    });
  }
};

// 更新案件
export const updateCase = async (req, res) => {
  try {
    console.log('Updating case:', {
      id: req.params.id,
      updateData: req.body,
    });

    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        category: req.body.category,
        assignedTo: req.body.assignedTo,
        dueDate: req.body.dueDate,
        location: req.body.location,
        budget: req.body.budget,
        contactInfo: {
          name: req.body.contactInfo?.name,
          phone: req.body.contactInfo?.phone,
          email: req.body.contactInfo?.email,
        },
        tags: req.body.tags,
        attachments: req.body.attachments,
        comments: req.body.comments,
        progress: req.body.progress,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCase) {
      return res.status(404).json({ message: '案件不存在' });
    }

    res.json({
      message: '更新成功',
      case: updatedCase,
    });
  } catch (error) {
    console.error('Update case error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: '驗證錯誤',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      message: '更新案件失敗',
      error: error.message,
    });
  }
};

// 刪除案件
export const deleteCase = async (req, res) => {
  try {
    const deletedCase = await Case.findByIdAndDelete(req.params.id);
    if (!deletedCase) {
      return res.status(404).json({ message: '案件不存在' });
    }
    res.json({ message: '案件已刪除' });
  } catch (error) {
    console.error('Delete case error:', error);
    res.status(500).json({ message: '刪除案件失敗' });
  }
};

// 搜索案件
export const searchCases = async (req, res) => {
  try {
    const { query } = req.query;
    const cases = await Case.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { status: { $regex: query, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    res.json(cases);
  } catch (error) {
    console.error('Search cases error:', error);
    res.status(500).json({ message: '搜索案件失敗' });
  }
};

// 按狀態篩選案件
export const filterCasesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const cases = await Case.find({ status }).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error) {
    console.error('Filter cases error:', error);
    res.status(500).json({ message: '篩選案件失敗' });
  }
};

// 獲取案件統計
export const getCaseStats = async (req, res) => {
  try {
    const stats = await Case.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Get case stats error:', error);
    res.status(500).json({ message: '獲取統計資料失敗' });
  }
};
