import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
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

personSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Person = mongoose.model('Person', personSchema);
export default Person;
