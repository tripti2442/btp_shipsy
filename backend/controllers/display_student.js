const jwt = require('jsonwebtoken');
const User = require('../models/Users.js');
const Group = require('../models/Groups.js');


const verifyToken = async (req) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return { error: 'Unauthorized: No token provided', status: 401 };
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        const { username, roll_no, role } = decodedToken;

        if (role !== 'student') {
            return { error: 'Unauthorized: Only students can perform this action', status: 403 };
        }

        return { name: username, roll_no, status: 200 };

    } catch (error) {
        console.error('JWT verification error:', error);
        return { error: 'Unauthorized: Invalid or expired token', status: 401 };
    }
};

const display_group = async (req, res) => {
    try {
        const { name, roll_no, status, error } = await verifyToken(req);
        if (status !== 200) {
            return res.status(status).json({ message: error });
        }

        const student = await User.findOne({ roll_no });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Populate members (username + roll_no) and supervisor (username)
        const existingGroup = await Group.findOne({ members: student._id })
            .populate('members', 'username roll_no')  // only get username & roll_no for members
            .populate('supervisor_id', 'username');      // only get username for supervisor

        if (!existingGroup) {
            return res.status(404).json({ message: "No Group Found." });
        }

        return res.status(200).json({
            message: "Group Found!",
            existingGroup
        });

    } catch (err) {
        console.error("Error in displaying_group:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { display_group };
