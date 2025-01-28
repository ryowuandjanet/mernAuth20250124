import mongoose from 'mongoose';

const landSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
  },
  landNumber: {
    type: String,
    required: true,
  },
  landUrl: {
    type: String,
  },
  landArea: {
    type: Number,
    required: true,
  },
  landHoldingPointPersonal: {
    type: String,
    required: true,
  },
  landHoldingPointAll: {
    type: String,
    required: true,
  },
  landRemark: {
    type: String,
  },
  landUpdated: {
    type: Date,
    default: Date.now,
  },
  calculatedArea: {
    type: Number,
    default: 0,
  },
});

landSchema.pre('save', function (next) {
  this.landUpdated = Date.now();

  const personalPoint = parseFloat(this.landHoldingPointPersonal);
  const allPoint = parseFloat(this.landHoldingPointAll);

  if (!isNaN(personalPoint) && !isNaN(allPoint) && allPoint !== 0) {
    this.calculatedArea =
      Math.round(this.landArea * (personalPoint / allPoint) * 100) / 100;
  } else {
    this.calculatedArea = 0;
  }

  next();
});

landSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (
    update &&
    update.landArea &&
    update.landHoldingPointPersonal &&
    update.landHoldingPointAll
  ) {
    const personalPoint = parseFloat(update.landHoldingPointPersonal);
    const allPoint = parseFloat(update.landHoldingPointAll);

    if (!isNaN(personalPoint) && !isNaN(allPoint) && allPoint !== 0) {
      update.calculatedArea =
        Math.round(update.landArea * (personalPoint / allPoint) * 100) / 100;
    } else {
      update.calculatedArea = 0;
    }
  }
  next();
});

const Land = mongoose.model('Land', landSchema);
export default Land;
