const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, 'nveiugeuwigvbwi');
        req.user = await userModel.findOne({ email: decoded.email });
        next();
    } catch (err) {
        res.redirect('/login');
    }
};

module.exports = { isAuthenticated };
