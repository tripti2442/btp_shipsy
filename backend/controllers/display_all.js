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


const display_all = async (req, res) => {
    try {
        
        const { name, status, error } = await verifyToken(req);
        if (status !== 200) {
            return res.status(status).json({ message: error });
        }

        
        const groups = await Group.find()
            .populate('supervisor_id', 'username role') 
            .populate('members', 'username role roll_no'); 

        res.status(200).json({
            message: "All groups fetched successfully",
            groups
        });

    } catch (err) {
        console.error("Error fetching groups:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { display_all };
