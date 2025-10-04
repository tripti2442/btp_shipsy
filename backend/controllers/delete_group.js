const jwt = require('jsonwebtoken');
const User = require('../models/Users.js');
const Group = require('../models/Groups.js');
const Evaluation = require('../models/Evaluations.js');

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


const delete_grp = async (req, res) => {
    try {

        const { name, status, error } = await verifyToken(req);
        if (status !== 200) {
            return res.status(status).json({ message: error });
        }

        const groupId = req.params._id;
        if (!groupId) {
            return res.status(400).json({ message: "Group ID is required" });
        }
        const group = await Group.findById(groupId)
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        

        const delete_group= await Group.findByIdAndDelete(
            groupId,
        )

        const evaluation = await Evaluation.findOneAndDelete({ group_id: groupId });


       

        return res.status(200).json({
            message: "Group deleted successfully",
            
        });





    } catch (err) {
        console.error("Error deleting group:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { delete_grp };
