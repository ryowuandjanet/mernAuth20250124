import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  caseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  company: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  section: String,
  subsection: String,
  village: String,
  neighborhood: String,
  street: String,
  streetSection: String,
  lane: String,
  alley: String,
  number: String,
  floor: String,
  status: {
    type: String,
    enum: ['處理中', '已完成'],
    default: '處理中',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// 更新時間中間件
caseSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Case = mongoose.model('Case', caseSchema);
export default Case;
