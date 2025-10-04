const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['student', 'supervisor', 'admin'],
        required: true
    },

    roll_no: {
        type: String,
        unique: true, // ensure unique across all docs
        sparse: true, // this makes uniqueness apply only when roll_no exists
        required: function () {
            return this.role === 'student'; 
        }
    },

    created_at: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
