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


        return { name: username, status: 200 };
    } catch (error) {
        console.error('JWT verification error:', error);
        return { error: 'Unauthorized: Invalid or expired token', status: 401 };
    }
};

const fetch_students = async (req, res) => {
  try {
    // Verify admin token
    const { name, status, error } = await verifyToken(req);
    if (status !== 200) {
      return res.status(status).json({ message: error });
    }

    // Step 1: Find all students
    const allStudents = await User.find({ role: 'student' });

    // Step 2: Find students who are already in a group
    const groups = await Group.find({}, 'members'); // Only fetch members field
    const allocatedStudentIds = groups.flatMap(g => g.members.map(m => m.toString()));

    // Step 3: Filter out students who are already allocated
    const unallocatedStudents = allStudents.filter(
      student => !allocatedStudentIds.includes(student._id.toString())
    );

    // Step 4: Return unallocated students
    res.status(200).json({
      message: 'Unallocated students fetched successfully',
      students: unallocatedStudents
    });

  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { fetch_students };
