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

        return { admin_name: username, roll_no, status: 200 };

    } catch (error) {
        console.error('JWT verification error:', error);
        return { error: 'Unauthorized: Invalid or expired token', status: 401 };
    }
};


const create_group = async (req, res) => {
    try {
        
        const { admin_name, roll_no, status, error } = await verifyToken(req);
        if (status !== 200) {
            return res.status(status).json({ message: error });
        }

        
        const student = await User.findOne({ roll_no });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

       
        const existingGroup = await Group.findOne({ members: student._id });
        if (existingGroup) {
            return res.status(400).json({
                message: "You are already part of another group.",
                groupTitle: existingGroup.title
            });
        }

      
        const { title, supervisor_id, members } = req.body;

     
        const group = await Group.create({
            title,
            supervisor_id,
            members,
            is_registered: false
        });

        return res.status(201).json({
            message: "Group created successfully!",
            group
        });

    } catch (err) {
        console.error("Error in create_group:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { create_group };
