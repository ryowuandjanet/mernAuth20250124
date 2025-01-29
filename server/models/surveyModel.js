import mongoose from 'mongoose';

const surveySchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: true,
  },
  surveyFirstDay: {
    type: Date,
  },
  surveySecondDay: {
    type: Date,
  },
  surveyForeclosureAnnouncementLink: {
    type: String,
  },
  survey988Link: {
    type: String,
  },
  surveyObjectPhotoLink: {
    type: String,
  },
  surveyForeclosureRecordLink: {
    type: String,
  },
  surveyObjectViewLink: {
    type: String,
  },
  surveyPagesViewLink: {
    type: String,
  },
  surveyMoneytViewLink: {
    type: String,
  },
});

const Survey = mongoose.model('Survey', surveySchema);
export default Survey;
