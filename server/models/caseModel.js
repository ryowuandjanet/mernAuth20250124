import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, '請輸入標題'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, '請輸入描述'],
      trim: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
    priority: {
      type: String,
      default: 'medium',
    },
    category: {
      type: String,
      default: '一般',
    },
    assignedTo: {
      type: String,
      default: '未指派',
    },
    dueDate: {
      type: Date,
      default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000), // 預設7天後
    },
    location: {
      type: String,
      default: '未指定',
    },
    budget: {
      type: Number,
      default: 0,
    },
    contactInfo: {
      name: {
        type: String,
        default: '',
      },
      phone: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        default: '',
      },
    },
    tags: [
      {
        type: String,
      },
    ],
    attachments: [
      {
        name: String,
        url: String,
        type: String,
      },
    ],
    comments: [
      {
        text: String,
        createdBy: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
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
  },
  {
    timestamps: true,
  },
);

const Case = mongoose.model('Case', caseSchema);
export default Case;
