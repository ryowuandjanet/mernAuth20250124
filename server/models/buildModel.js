import mongoose from 'mongoose';

const buildSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
  },
  buildNumber: {
    type: String,
    required: true,
  },
  buildUrl: {
    type: String,
  },
  buildArea: {
    type: Number,
    required: true,
  },
  buildHoldingPointPersonal: {
    type: String,
    required: true,
  },
  buildHoldingPointAll: {
    type: String,
    required: true,
  },
  buildTypeUse: {
    type: String,
    required: true,
  },
  buildUsePartition: {
    type: String,
    required: true,
  },
  buildRemark: {
    type: String,
  },
  buildAncillaryBuildingUseBy: {
    type: String,
  },
  buildAncillaryBuildingArea: {
    type: Number,
  },
  buildUpdated: {
    type: Date,
    default: Date.now,
  },
  calculatedArea: {
    type: Number,
    default: 0,
  },
});

buildSchema.pre('save', function (next) {
  this.buildUpdated = Date.now();

  const personalPoint = parseFloat(this.buildHoldingPointPersonal);
  const allPoint = parseFloat(this.buildHoldingPointAll);

  if (!isNaN(personalPoint) && !isNaN(allPoint) && allPoint !== 0) {
    const coefficient = this.buildTypeUse === '增建-持分後坪數打對折' ? 0.5 : 1;

    this.calculatedArea =
      Math.round(
        this.buildArea * (personalPoint / allPoint) * coefficient * 100,
      ) / 100;
  } else {
    this.calculatedArea = 0;
  }

  next();
});

buildSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (
    update &&
    update.buildArea &&
    update.buildHoldingPointPersonal &&
    update.buildHoldingPointAll
  ) {
    const personalPoint = parseFloat(update.buildHoldingPointPersonal);
    const allPoint = parseFloat(update.buildHoldingPointAll);

    if (!isNaN(personalPoint) && !isNaN(allPoint) && allPoint !== 0) {
      const coefficient =
        update.buildTypeUse === '增建-持分後坪數打對折' ? 0.5 : 1;
      update.calculatedArea =
        Math.round(
          update.buildArea * (personalPoint / allPoint) * coefficient * 100,
        ) / 100;
    } else {
      update.calculatedArea = 0;
    }
  }
  next();
});

const Build = mongoose.model('Build', buildSchema);
export default Build;
