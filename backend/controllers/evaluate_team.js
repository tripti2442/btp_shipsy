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

        if (role !== 'supervisor') {
            return { error: 'Unauthorized: Only supervisor can perform this action', status: 403 };
        }

        return { name: username, status: 200 };

    } catch (error) {
        console.error('JWT verification error:', error);
        return { error: 'Unauthorized: Invalid or expired token', status: 401 };
    }
};


const evaluate_team = async (req, res) => {
    try {

        const { name, status, error } = await verifyToken(req);
        if (status !== 200) {
            return res.status(status).json({ message: error });
        }

        const supervisor = await User.findOne({
            username: name,
            role: 'supervisor'
        })

        if (!supervisor) {
            return null; // supervisor not found
        }
        const supervisorId = supervisor._id;

        const group_id = req.params.groupId;
        if (!group_id) {
            return res.status(400).json({ message: "Group ID is required" });
        }

        const {
            report_marks,
            literature_survey_marks,
            work_done_marks,
            presentation_marks
        } = req.body;

        const existingEvaluation = await Evaluation.findOne({ group_id });
        if (existingEvaluation) {
            return res.status(400).json({ message: "Evaluation for this group already exists" });
        }

        const evaluation = new Evaluation({
            group_id,
            report_marks,
            literature_survey_marks,
            work_done_marks,
            presentation_marks
        });

        await evaluation.save();
        const updatedGroup = await Group.findByIdAndUpdate(
            group_id,                      
            {is_evaluated: true }, 
            { new: true, runValidators: true }          
        );
        //new: true → returns the updated document instead of the old one.
        //runValidators: true → ensures your schema validations (e.g., required fields, min/max, enum) run on the updated data.



        res.status(201).json({
            message: "Evaluation created successfully",
            evaluation
        });

    } catch (err) {
        console.error("Error creating evaluation:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { evaluate_team };
