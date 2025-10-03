const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  roll_no: {
    type: String,
    required: true,
    unique: true
  },
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'   // Reference to the Group collection
  },
  supervisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'    // Reference to User (should be a supervisor in logic)
  },
  project_title: {
    type: String,
    required: true
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
