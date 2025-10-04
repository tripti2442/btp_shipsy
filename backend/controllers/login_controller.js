const User = require('../models/Users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  console.log("Login endpoint hit");

  const { username, password, role, roll_no } = req.body;

  try {
    //  Base query for user
    let query = { username, role };

    //  If student, also match roll number
    if (role === 'student') {
      if (!roll_no) {
        return res.status(400).json({ message: 'Roll number is required for students.' });
      }
      query.roll_no = roll_no;
    }

    const existUser = await User.findOne(query);

    if (!existUser) {
      console.log("User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existUser.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    
    const token = jwt.sign(
      {
        id: existUser._id,
        username: existUser.username,
        role: existUser.role,
        ...(existUser.role === 'student' && { roll_no: existUser.roll_no })
      },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'None',
      secure: true
    };

   
    res.cookie('token', token, options);
    console.log("JWT:", token);

    res.status(200).json({
      message: 'You have successfully logged in!',
      success: true,
      logged_in: true,
      token,
      user: {
        username: existUser.username,
        role: existUser.role,
        ...(existUser.role === 'student' && { roll_no: existUser.roll_no })
      }
    });

  } catch (error) {
    console.error('Error occurred during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { login };
