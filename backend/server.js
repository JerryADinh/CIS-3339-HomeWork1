const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load .env from backend/ or project root
const backendEnvPath = path.resolve(__dirname, '.env');
const rootEnvPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

const Student = require('./models/Student');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cis3339_homework1';

app.use(cors());
app.use(express.json());

function handleDatabaseError(err, res, duplicateMessage) {
  if (err && err.code === 11000) {
    return res.status(409).json({
      error: duplicateMessage || 'A record with this unique identifier already exists.'
    });
  }
  if (err && err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(' ') });
  }
  console.error('Database Error:', err);
  return res.status(500).json({ error: 'An unexpected internal server error occurred.' });
}

// ==========================================
// STUDENT ENDPOINTS (/api/students)
// ==========================================

app.get('/api/students', async (req, res) => {
  try {
    const query = (req.query.q || '').trim();
    const filter = query
      ? {
          $or: [
            { name: { $regex: query,$options: 'i' } },
            { studentId: { $regex: query,$options: 'i' } }
          ]
        }
      : {};
    const students = await Student.find(filter).sort({ studentId: 1, name: 1 });
    return res.status(200).json(students);
  } catch (err) {
    return handleDatabaseError(err, res);
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const studentId = String(req.body.studentId ?? req.body.id ?? '').trim();
    const phone = String(req.body.phone || '').trim();
    const zip = String(req.body.zip || '').trim();

    if (!name || !studentId || !phone || !zip) {
      return res.status(400).json({
        error: 'All fields (name, student ID, phone number, and ZIP code) are required.'
      });
    }

    const existing = await Student.findOne({ studentId });
    if (existing) {
      return res.status(409).json({
        error: `A student with Student ID "${studentId}" already exists.`
      });
    }

    const student = await Student.create({ name, studentId, phone, zip });
    return res.status(201).json(student);
  } catch (err) {
    return handleDatabaseError(
      err,
      res,
      'A student with this Student ID already exists.'
    );
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const identifier = req.params.id;
    let student = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      student = await Student.findById(identifier);
    }
    if (!student) {
      student = await Student.findOne({ studentId: identifier });
    }

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const deletedEnrollments = await Enrollment.deleteMany({ student: student._id });
    await Student.deleteOne({ _id: student._id });

    return res.status(200).json({
      message: `Student "${student.name}" (${student.studentId}) deleted successfully.`,
      removedEnrollments: deletedEnrollments.deletedCount
    });
  } catch (err) {
    return handleDatabaseError(err, res);
  }
});

// ==========================================
// LEGACY STUDENT ENDPOINTS
// ==========================================

app.post('/find-student', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    if (!name) {
      return res.status(400).json({ error: 'Student name is required.' });
    }
    const student = await Student.findOne({
      name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
    });
    if (!student) {
      return res.status(404).json({ error: 'Cannot find the student.' });
    }
    return res.status(200).json(student);
  } catch (err) {
    return handleDatabaseError(err, res);
  }
});

app.post('/add-student', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const studentId = String(req.body.studentId ?? req.body.id ?? '').trim();
    const phone = String(req.body.phone || '').trim();
    const zip = String(req.body.zip || '').trim();

    if (!name || !studentId || !phone || !zip) {
      return res.status(400).json({ error: 'All student fields are required.' });
    }

    const existing = await Student.findOne({ studentId });
    if (existing) {
      return res.status(409).json({
        error: `Student ID "${studentId}" already exists.`
      });
    }

    const student = await Student.create({ name, studentId, phone, zip });
    return res.status(201).json(student);
  } catch (err) {
    return handleDatabaseError(err, res, 'Duplicate student ID.');
  }
});

app.post('/delete-student', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const studentId = String(req.body.studentId ?? req.body.id ?? '').trim();
    const query = studentId ? { studentId } : { name: { $regex: `^${name}$`, $options: 'i' } };
    const student = await Student.findOne(query);

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    await Enrollment.deleteMany({ student: student._id });
    await Student.deleteOne({ _id: student._id });

    return res.status(200).json({ message: 'Student deleted successfully.' });
  } catch (err) {
    return handleDatabaseError(err, res);
  }
});

// ==========================================
// COURSE ENDPOINTS (/api/courses)
// ==========================================

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find().sort({ courseId: 1 });
    return res.status(200).json(courses);
  } catch (err) {
    return handleDatabaseError(err, res);
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const courseId = String(req.body.courseId || '').trim();
    const courseName = String(req.body.courseName ?? req.body.name ?? '').trim();

    if (!courseId || !courseName) {
      return res.status(400).json({
        error: 'Both Course ID and Course Name are required.'
      });
    }

    const existing = await Course.findOne({
      courseId: { $regex: `^${courseId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' }
    });
    if (existing) {
      return res.status(409).json({
        error: `A course with Course ID "${courseId}" already exists.`
      });
    }

    const course = await Course.create({ courseId, courseName });
    return res.status(201).json(course);
  } catch (err) {
    return handleDatabaseError(
      err,
      res,
      'A course with this Course ID already exists.'
    );
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const identifier = req.params.id;
    let course = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      course = await Course.findById(identifier);
    }
    if (!course) {
      course = await Course.findOne({ courseId: identifier });
    }

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const deletedEnrollments = await Enrollment.deleteMany({ course: course._id });
    await Course.deleteOne({ _id: course._id });

    return res.status(200).json({
      message: `Course "${course.courseId} - ${course.courseName}" deleted successfully.`,
      removedEnrollments: deletedEnrollments.deletedCount
    });
  } catch (err) {
    return handleDatabaseError(err, res);
  }
});

// ==========================================
// ENROLLMENT ENDPOINTS (/api/enrollments)
// ==========================================

app.get('/api/enrollments', async (req, res) => {
  try {
    const { courseId } = req.query;
    const filter = {};

    if (courseId) {
      if (mongoose.Types.ObjectId.isValid(courseId)) {
        filter.course = courseId;
      } else {
        const courseDoc = await Course.findOne({ courseId });
        if (!courseDoc) {
          return res.status(404).json({ error: 'Course not found.' });
        }
        filter.course = courseDoc._id;
      }
    }

    const enrollments = await Enrollment.find(filter)
      .populate('student')
      .populate('course')
      .sort({ createdAt: -1 });

    const validEnrollments = enrollments.filter((e) => e.student && e.course);
    return res.status(200).json(validEnrollments);
  } catch (err) {
    return handleDatabaseError(err, res);
  }
});

app.post('/api/enrollments', async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        error: 'Both a student and a course must be selected.'
      });
    }

    let student = null;
    if (mongoose.Types.ObjectId.isValid(studentId)) {
      student = await Student.findById(studentId);
    }
    if (!student) {
      student = await Student.findOne({ studentId: String(studentId).trim() });
    }
    if (!student) {
      return res.status(404).json({ error: 'Selected student does not exist.' });
    }

    let course = null;
    if (mongoose.Types.ObjectId.isValid(courseId)) {
      course = await Course.findById(courseId);
    }
    if (!course) {
      course = await Course.findOne({ courseId: String(courseId).trim() });
    }
    if (!course) {
      return res.status(404).json({ error: 'Selected course does not exist.' });
    }

    const existing = await Enrollment.findOne({
      student: student._id,
      course: course._id
    });
    if (existing) {
      return res.status(409).json({
        error: `${student.name} (${student.studentId}) is already enrolled in ${course.courseId}.`
      });
    }

    const enrollment = await Enrollment.create({
      student: student._id,
      course: course._id
    });

    const populated = await Enrollment.findById(enrollment._id)
      .populate('student')
      .populate('course');

    return res.status(201).json(populated);
  } catch (err) {
    return handleDatabaseError(
      err,
      res,
      'This student is already enrolled in the selected course.'
    );
  }
});

app.get('/api/courses/:id/students', async (req, res) => {
  try {
    const identifier = req.params.id;
    let course = null;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      course = await Course.findById(identifier);
    }
    if (!course) {
      course = await Course.findOne({ courseId: identifier });
    }
    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const enrollments = await Enrollment.find({ course: course._id })
      .populate('student')
      .populate('course')
      .sort({ createdAt: 1 });

    const students = enrollments
      .filter((e) => e.student)
      .map((e) => ({
        enrollmentId: e._id,
        _id: e.student._id,
        name: e.student.name,
        studentId: e.student.studentId,
        id: e.student.studentId,
        phone: e.student.phone,
        zip: e.student.zip,
        enrolledAt: e.createdAt
      }));

    return res.status(200).json({
      course,
      students
    });
  } catch (err) {
    return handleDatabaseError(err, res);
  }
});

// ==========================================
// SERVE VUE PRODUCTION BUILD & SPA FALLBACK
// ==========================================

const distPath = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    return res.sendFile(path.join(distPath, 'index.html'));
  });
}

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    await Promise.all([Student.init(), Course.init(), Enrollment.init()]);
    console.log(`Connected to MongoDB at ${MONGODB_URI}`);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

startServer();