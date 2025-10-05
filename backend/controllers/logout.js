const jwt = require('jsonwebtoken');

const logout = async (req, res) => {
    try {
        
        res.clearCookie('token');

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out:', error);
        return res.status(500).json({ error: 'Error logging out' });
    }
};

module.exports = { logout };






