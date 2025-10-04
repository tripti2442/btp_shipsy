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
        const { username, role } = decodedToken;

        if (role !== 'admin') {
            return { error: 'Unauthorized: Only admins can perform this action', status: 403 };
        }

        return { name: username, status: 200 };
    } catch (error) {
        console.error('JWT verification error:', error);
        return { error: 'Unauthorized: Invalid or expired token', status: 401 };
    }
};

const update_grp = async (req, res) => {
    try {
        const { name, status, error } = await verifyToken(req);
        if (status !== 200) {
            return res.status(status).json({ message: error });
        }

        const groupId = req.params._id;
        if (!groupId) {
            return res.status(400).json({ message: "Group ID is required" });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const { title, supervisor_name, members } = req.body;

        // ✅ Step 1: Validate supervisor
        let supervisor_id = null;
        if (supervisor_name) {
            const supervisor = await User.findOne({ username: supervisor_name, role: 'supervisor' });
            if (!supervisor) {
                return res.status(400).json({ message: "Invalid supervisor name" });
            }
            supervisor_id = supervisor._id;
        }
        

        // ✅ Step 2: Validate and fetch member IDs using roll_no
        let member_ids = [];
        if (members && members.length > 0) {
            const rollNumbers = members.map(m => m.roll_no); // expecting array of { username, roll_no }
            const foundStudents = await User.find({ roll_no: { $in: rollNumbers }, role: 'student' });

            if (foundStudents.length !== members.length) {
                return res.status(400).json({ message: "Some members not found or not students" });
            }

            if (foundStudents.length > 3) {
                return res.status(400).json({ message: "Group cannot have more than 3 members" });
            }

            member_ids = foundStudents.map(s => s._id);
        }


        const updateFields = {};


        if (title) {
            updateFields.title = title;
        }

        if (supervisor_id) {
            updateFields.supervisor_id = supervisor_id;
        }

        if (member_ids && member_ids.length > 0) {
            updateFields.members = member_ids;
        }


        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            updateFields,
            { new: true, runValidators: true }
        )
            .populate('members', 'username roll_no')
            .populate('supervisor_id', 'username');


        if (!updatedGroup) {
            return res.status(404).json({ message: "Group not found after update" });
        }

        return res.status(200).json({
            message: "Group updated successfully",
            group: updatedGroup
        });

    } catch (err) {
        console.error("Error updating group:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { update_grp };
