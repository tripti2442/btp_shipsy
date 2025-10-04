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
        })
        
        if (!supervisor) {
            return null; // supervisor not found
        }

        const supervisorId= supervisor._id;

        const groups = await Group.find({supervisor_id : supervisorId});


        return res.status(201).json({
            message: "Groups Found!",
            groups
        });

    } catch (err) {
        console.error("Error in displaying_group:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { display_teams };
