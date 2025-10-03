const mongoose = require('mongoose');

function arrayLimit(val) {
    return val.length <= 3;
}

const groupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    supervisor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // Note: Ensure role is 'supervisor' in application logic
    },
    members: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }],
        required: true,
        validate: [arrayLimit, 'Group cannot have more than 3 members.']
    },
    is_registered: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;