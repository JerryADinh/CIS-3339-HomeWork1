const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: [true, 'Course ID is required.'],
      unique: true,
      trim: true
    },
    courseName: {
      type: String,
      required: [true, 'Course name is required.'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Course', courseSchema);