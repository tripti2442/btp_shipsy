const User = require('../models/Users.js');
const jwt = require('jsonwebtoken');

// Reuse the verifyToken function for admin verification
const verifyToken = async (req) => {
  try {
    const token = req.cookies.token;
    if (!token) return { error: 'Unauthorized: No token provided', status: 401 };

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const { username, role } = decodedToken;

    

    return { name: username, status: 200 };
  } catch (error) {
    console.error('JWT verification error:', error);
    return { error: 'Unauthorized: Invalid or expired token', status: 401 };
  }
};

// Fetch all supervisors
const fetch_supervisors = async (req, res) => {
  try {
    const { name, status, error } = await verifyToken(req);
    if (status !== 200) return res.status(status).json({ message: error });

    const supervisors = await User.find({ role: 'supervisor' }).select('username'); 
    // Selecting only username field, can add _id too if needed

    res.status(200).json({
      message: 'Supervisors fetched successfully',
      supervisors
    });
  } catch (err) {
    console.error('Error fetching supervisors:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { fetch_supervisors };
