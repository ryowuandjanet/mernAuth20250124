import mongoose from 'mongoose';

const referenceObjectSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
    objectBuildAddress: {
      type: String,
      required: true,
    },
    objectBuildTotalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    objectBuildBuildArea: {
      type: Number,
      required: true,
      min: 0,
    },
    objectBuildSubBuildArea: {
      type: Number,
      min: 0,
    },
    objectBuildHouseAge: {
      type: Number,
      min: 0,
    },
    objectBuildFloorHeight: {
      type: String,
    },
    objectBuildStatus: {
      type: String,
    },
    objectBuildTransactionDate: {
      type: Date,
    },
    objectBuildUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('ReferenceObject', referenceObjectSchema);
