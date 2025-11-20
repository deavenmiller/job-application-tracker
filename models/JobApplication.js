import mongoose from 'mongoose';

const JobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: [
      'Applied',
      'Take-Home Assessment',
      'Objective Assessment',
      'Technical Interview',
      'Behavioral Interview',
      'Final Interview',
      'Rejected',
      'Waitlisted',
      'Ghosted',
      'Accepted',
    ],
    default: 'Applied',
  },
  jobLink: {
    type: String,
    default: '',
  },
  payRange: {
    type: String,
    default: '',
  },
  benefits: {
    type: String,
    default: '',
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time',
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  jobDescription: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Force recompilation to ensure schema changes are applied
if (mongoose.models.JobApplication) {
  delete mongoose.models.JobApplication;
}

export default mongoose.model('JobApplication', JobApplicationSchema);

