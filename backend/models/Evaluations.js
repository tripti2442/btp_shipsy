const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
    group_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    report_marks: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    literature_survey_marks: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    work_done_marks: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    presentation_marks: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    total_marks: {
        type: Number
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to calculate total_marks
evaluationSchema.pre('save', function(next) {
    this.total_marks = this.report_marks +
                        this.literature_survey_marks +
                        this.work_done_marks +
                        this.presentation_marks;
    next();
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;