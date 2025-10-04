const jwt = require('jsonwebtoken');
const User = require('../models/Users.js');
const Group = require('../models/Groups.js');
const Evaluation = require('../models/Evaluations.js'); // Import Evaluation

// Verify student token
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

// Fetch evaluation for student's group
const student_evaluation = async (req, res) => {
    try {
        const { name, roll_no, status, error } = await verifyToken(req);
        if (status !== 200) {
            return res.status(status).json({ message: error });
        }

        // Find the student by roll number
        const student = await User.findOne({ roll_no });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Find the group the student belongs to
        const existingGroup = await Group.findOne({ members: student._id })
            .populate({
                path: 'members',
                select: 'username roll_no'
            })
            .populate({
                path: 'supervisor_id',
                select: 'username' // only include supervisor's username
            });

        if (!existingGroup) {
            return res.status(404).json({ message: "Group not found" });
        }

        const groupId = existingGroup._id;

        // Fetch evaluation for this group
        const evaluation = await Evaluation.findOne({ group_id: groupId });

        // Return evaluation (empty if not done yet)
        res.status(200).json({
            message: "Evaluation fetched successfully",
            group: {
                team_number: existingGroup._id,
                title: existingGroup.title,
                is_evaluated: existingGroup.is_evaluated,
                members: existingGroup.members,
                supervisor: existingGroup.supervisor_id, // contains only username
                evaluation: evaluation || {
                    report_marks: null,
                    literature_survey_marks: null,
                    work_done_marks: null,
                    presentation_marks: null,
                    total_marks: null
                }
            }
        });

    } catch (err) {
        console.error("Error fetching evaluation:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { student_evaluation };
