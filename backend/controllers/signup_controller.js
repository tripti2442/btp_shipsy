const User = require('../models/Users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const { username, password, role, roll_no } = req.body;

  try {
    // ✅ Validate required fields
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required.' });
    }

    // ✅ For students, roll_no is required
    if (role === 'student' && !roll_no) {
      return res.status(400).json({ message: 'Roll number is required for students.' });
    }

    // ✅ Check if user already exists
    const existUser = await User.findOne({
      username,
      role,
      ...(role === 'student' && { roll_no })
    });

    if (existUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      ...(role === 'student' && { roll_no })
    });

    // ✅ Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        ...(user.role === 'student' && { roll_no: user.roll_no })
      },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    // ✅ Cookie options
    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'None',
      secure: true
    };

    res.cookie('token', token, options);

    console.log("✅ Signup successful for:", user.username);

    // ✅ Send response
    res.status(201).json({
      message: 'Signup successful!',
      success: true,
      logged_in: true,
      token,
      user: {
        username: user.username,
        role: user.role,
        ...(user.role === 'student' && { roll_no: user.roll_no })
      }
    });

  } catch (error) {
    console.error("❌ Error during signup:", error);

    // Handle unique constraint error
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Username or roll number already exists.' });
    }

    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { signup };
