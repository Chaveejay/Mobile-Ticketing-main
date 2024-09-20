const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation, updateProfileValidation } = require('../validation');
const crypto = require('crypto');
const { sendOtpSms } = require('../services/twilioService');

const signUp = async (req, res, next) => {
    // Validation
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user is already in the database
    const phoneExist = await User.findOne({ phone: req.body.phone });
    if (phoneExist) return res.status(400).send("Phone already exists");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user object with common fields
    const user = new User({
        phone: req.body.phone,
        password: hashedPassword,
        role: req.body.role
    });

    // Add role-based fields
    if (req.body.role !== 'Admin') {
        if (!req.body.first_name || !req.body.last_name) {
            return res.status(400).send("First name and last name are required");
        }
        user.first_name = req.body.first_name;
        user.last_name = req.body.last_name;
    }

    if (req.body.role === 'Organizer') {
        if (!req.body.org_name || !req.body.nic) {
            return res.status(400).send("Organization name and NIC are required");
        }
        user.org_name = req.body.org_name;
        user.nic = req.body.nic;
    }

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
};

const signIn = async (req, res, next) => {
    // Validation
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user is already in the database
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) return res.status(400).send("Phone doesn't exist");

    // Check password
    const validPwd = await bcrypt.compare(req.body.password, user.password);
    if (!validPwd) return res.status(400).send("Invalid password");

    // Create and assign a token
    const token = jwt.sign({ _id: user.id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: "1h" });

    // Send the token and role to the client
    return res.status(200).json({
        message: "Auth successful",
        token: token,
        role: user.role 
    });
};

const forgotPassword = async (req, res) => {
    const { phone } = req.body;

    // Validate input
    const { error } = forgotPasswordValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user is already in the database
    const user = await User.findOne({ phone: phone });
    if (!user) return res.status(400).send("Phone doesn't exist");

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Set OTP and expiry time
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 3600000; // 1 hour from now

    // Format phone number to E.164 format
    const formattedPhone = formatPhoneNumber(phone);

    // Send OTP to user's phone
    try {
        await sendOtpSms(formattedPhone, otp);
        await user.save();
        res.send('OTP sent to your phone number');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Phone number formatting function
const formatPhoneNumber = (phoneNumber) => {
    // Remove any leading zeros
    if (phoneNumber.startsWith('0')) {
        phoneNumber = phoneNumber.substring(1);
    }
    // Add the country code
    return `+94${phoneNumber}`;
};

const resetPassword = async (req, res) => {
    const { phone, otp, newPassword, confirmPassword } = req.body;

    // Validate input
    const { error } = resetPasswordValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if the user is already in the database
    const user = await User.findOne({ phone: phone });
    if (!user) return res.status(400).send("Phone doesn't exist");

    // Check OTP and its expiry time
    if (user.resetOtp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).send("Invalid or expired OTP");
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    try {
        await user.save();
        res.send("Password reset successfully");
    } catch (err) {
        res.status(400).send(err);
    }
};

const getUserProfile = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).send("Unauthorized: No user ID found");
        }

        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).send("User not found");
        }
        
        res.json(user); // Sending the response in JSON format
    } catch (err) {
        console.error('Error fetching user profile:', err); // Log error details
        res.status(400).send("Error fetching user profile");
    }
};


const updateProfile = async (req, res) => {
    const { error } = updateProfileValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { first_name, last_name } = req.body;

    // Find user by ID from the token
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send("User not found");

    // Update fields
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;

    try {
        const updatedUser = await user.save();
        res.send(updatedUser);
    } catch (err) {
        res.status(400).send(err);
    }
};

const logout = async (req, res, next) => {
    try {
        res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred during logout",
            error: error.message
        });
    }
};

module.exports = {
    signUp,
    signIn,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updateProfile,
    logout
};