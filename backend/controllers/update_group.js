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

        const groupId = req.params.groupId;
        if (!groupId) {
            return res.status(400).json({ message: "Group ID is required" });
        }
        const group = await Group.findById(groupId)
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const { title, supervisor_id, members } = req.body;

        if (supervisor_id) {
            const supervisor = await User.findById(supervisor_id);
            if (!supervisor || supervisor.role !== 'supervisor') {
                return res.status(400).json({ message: "Invalid supervisor_id" });
            }
        }

        if (members && members.length > 0) {
            const students = await User.find({ _id: { $in: members } });
            if (students.some(s => s.role !== 'student')) {
                return res.status(400).json({ message: "All members must have role 'student'" });
            }
            if (members.length > 3) {
                return res.status(400).json({ message: "Group cannot have more than 3 members" });
            }

        }

        const updated_group= await Group.findByIdAndUpdate(
            groupId,
            { title, supervisor_id, members},
            { new: true, runValidators: true }
        )

        if (!updatedGroup) {
            return res.status(404).json({ message: "Group not found" });
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
