import mongoose from 'mongoose';

const actionResultSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
  },
  stopBuyDate: {
    type: Date,
  },
  actionResult: {
    type: String,
    enum: ['未判定', '撤回', '第三人搶標', '得標'],
    default: '未判定',
  },
  bidAuctionTime: {
    type: String,
  },
  bidMoney: {
    type: String,
  },
  objectNumber: {
    type: String,
  },
});

const ActionResult = mongoose.model('ActionResult', actionResultSchema);
export default ActionResult;
