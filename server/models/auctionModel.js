import mongoose from 'mongoose';
import Build from './buildModel.js';
import ReferenceObject from './referenceObjectModel.js';

const auctionSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
    auctionType: {
      type: String,
      required: true,
      enum: ['一拍', '二拍', '三拍', '四拍'], // 限制可選值
    },
    auctionDate: {
      type: Date,
      required: true,
    },
    auctionFloorPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: '底價必須為整數',
      },
    },
    auctionClick: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: '點閱必須為整數',
      },
    },
    auctionMonitor: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: '監控必須為整數',
      },
    },
    auctionCaseCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: '成交件數必須為整數',
      },
    },
    auctionMargin: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: '保証金必須為整數',
      },
    },
    pingValueTotal: {
      type: Number,
      get: (v) => Math.round(v * 0.3025 * 100) / 100, // 確保小數點兩位
    },
    pingPriceTotal: {
      type: Number,
      get: (v) => Math.round(v * 100) / 100,
    },
    nowPriceTotal: {
      type: Number,
      get: (v) => Math.round(v * 100) / 100,
    },
    pingCP: {
      type: Number,
      get: (v) => Math.round(v * 100) / 100,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  },
);

// 在保存前計算各個欄位
auctionSchema.pre('save', async function (next) {
  try {
    // 計算 pingValueTotal
    const builds = await Build.find({ caseId: this.caseId });
    this.pingValueTotal = builds.reduce(
      (sum, build) => sum + (build.calculatedArea || 0),
      0,
    );

    // 計算 pingPriceTotal
    if (this.pingValueTotal > 0) {
      this.pingPriceTotal =
        this.auctionFloorPrice / (this.pingValueTotal * 0.3025);
    }

    // 計算 nowPriceTotal
    const referenceObjects = await ReferenceObject.find({
      caseId: this.caseId,
    });
    if (referenceObjects.length > 0) {
      const totalAdjustedPrice = referenceObjects.reduce(
        (sum, obj) => sum + (obj.adjustedPrice || 0),
        0,
      );
      this.nowPriceTotal = totalAdjustedPrice / referenceObjects.length;
    }

    // 計算 pingCP
    if (this.pingPriceTotal > 0) {
      this.pingCP = this.nowPriceTotal / this.pingPriceTotal;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// 確保在更新操作時也會重新計算
auctionSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate) {
      // 重新計算所有欄位
      const builds = await Build.find({ caseId: docToUpdate.caseId });
      const pingValueTotal = builds.reduce(
        (sum, build) => sum + (build.calculatedArea || 0),
        0,
      );

      const auctionFloorPrice =
        this.getUpdate().auctionFloorPrice || docToUpdate.auctionFloorPrice;
      const pingPriceTotal =
        pingValueTotal > 0 ? auctionFloorPrice / (pingValueTotal * 0.3025) : 0;

      const referenceObjects = await ReferenceObject.find({
        caseId: docToUpdate.caseId,
      });
      let nowPriceTotal = 0;
      if (referenceObjects.length > 0) {
        const totalAdjustedPrice = referenceObjects.reduce(
          (sum, obj) => sum + (obj.adjustedPrice || 0),
          0,
        );
        nowPriceTotal = totalAdjustedPrice / referenceObjects.length;
      }

      const pingCP = pingPriceTotal > 0 ? nowPriceTotal / pingPriceTotal : 0;

      this.setUpdate({
        ...this.getUpdate(),
        pingValueTotal,
        pingPriceTotal,
        nowPriceTotal,
        pingCP,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Auction', auctionSchema);
