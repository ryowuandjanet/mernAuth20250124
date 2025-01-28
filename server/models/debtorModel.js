import mongoose from 'mongoose';

const debtorSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
  },
  name: {
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

debtorSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Debtor = mongoose.model('Debtor', debtorSchema);
export default Debtor;
