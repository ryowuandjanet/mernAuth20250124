import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
  {
    objectBuildScorer: {
      type: String,
      required: true,
    },
    objectBuildScorRate: {
      type: Number,
      required: true,
      min: -1,
      max: 1,
      get: (v) => Math.round(v * 100) / 100, // 確保小數點兩位
      set: (v) => Math.round(v * 100) / 100, // 儲存時也確保小數點兩位
    },
    objectBuildScorReason: {
      type: String,
      required: true,
    },
  },
  { _id: true },
);

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
    objectBuildFloorHeight: String,
    objectBuildStatus: String,
    objectBuildTransactionDate: Date,
    objectBuildUrl: String,
    scores: [scoreSchema],
    adjustedPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true }, // 確保 getter 在轉換為 JSON 時生效
  },
);

// 修改計算邏輯
referenceObjectSchema.pre('save', function (next) {
  if (this.scores && this.scores.length > 0) {
    // 計算所有評分的加成率總和
    const totalRate = this.scores.reduce(
      (sum, score) => sum + score.objectBuildScorRate,
      0,
    );

    // 計算調整後價格 (注意：不需要除以100，因為範圍已經是-1到1)
    this.adjustedPrice = Math.round(
      (this.objectBuildTotalPrice / this.objectBuildBuildArea) *
        (1 + totalRate),
    );
  } else {
    this.adjustedPrice = this.objectBuildTotalPrice / this.objectBuildBuildArea;
  }
  next();
});

// 同樣修改更新操作的計算邏輯
referenceObjectSchema.pre('findOneAndUpdate', async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  if (docToUpdate) {
    const scores = this.getUpdate().scores || docToUpdate.scores;
    const totalPrice =
      this.getUpdate().objectBuildTotalPrice ||
      docToUpdate.objectBuildTotalPrice;

    if (scores && scores.length > 0) {
      const totalRate = scores.reduce(
        (sum, score) => sum + score.objectBuildScorRate,
        0,
      );
      this.setUpdate({
        ...this.getUpdate(),
        adjustedPrice: Math.round(totalPrice * (1 + totalRate)),
      });
    } else {
      this.setUpdate({
        ...this.getUpdate(),
        adjustedPrice: totalPrice,
      });
    }
  }
  next();
});

const ReferenceObject = mongoose.model(
  'ReferenceObject',
  referenceObjectSchema,
);

export default ReferenceObject;
