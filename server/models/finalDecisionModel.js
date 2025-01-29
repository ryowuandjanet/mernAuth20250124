import mongoose from 'mongoose';

const finalDecisionSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
  },
  finalDecision: {
    type: String,
    enum: [
      '未判定',
      '1拍進場',
      '2拍進場',
      '3拍進場',
      '4拍進場',
      '4拍流標',
      '放棄',
    ],
    default: '未判定',
  },
  finalDecisionRemark: {
    type: String,
  },
  regionalHead: {
    type: String,
  },
  regionalHeadDate: {
    type: Date,
  },
  regionalHeadAddDate: {
    type: Date,
  },
  regionalHeadWorkArea: {
    type: String,
  },
});

const FinalDecision = mongoose.model('FinalDecision', finalDecisionSchema);
export default FinalDecision;
