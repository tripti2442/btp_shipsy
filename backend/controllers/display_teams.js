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


const display_teams = async (req, res) => {
    try {
        const { name, status, error } = await verifyToken(req);
        if (status !== 200) {
            return res.status(status).json({ message: error });
        }

        const supervisor = await User.findOne({
            username: name,
            role: 'supervisor'
        });

        if (!supervisor) {
            return res.status(404).json({ message: "Supervisor not found." });
        }

        const supervisorId = supervisor._id;

        // Populate members' username and roll_no
        const groups = await Group.find({ supervisor_id: supervisorId })
            .populate({
                path: 'members',
                select: 'username roll_no'
            });

        return res.status(200).json({
            message: "Groups Found!",
            groups
        });

    } catch (err) {
        console.error("Error in displaying_teams:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = { display_teams };
