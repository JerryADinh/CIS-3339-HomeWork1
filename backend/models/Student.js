const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required.'],
      trim: true
    },
    studentId: {
      type: String,
      required: [true, 'Student ID is required.'],
      unique: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required.'],
      trim: true
    },
    zip: {
      type: String,
      required: [true, 'ZIP code is required.'],
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret.studentId;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Student', studentSchema);