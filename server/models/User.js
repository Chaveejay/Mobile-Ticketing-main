const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: function() {
            return this.role === 'User' || this.role === 'Organizer';
        }
    },
    last_name: {
        type: String,
        required: function() {
            return this.role === 'User' || this.role === 'Organizer';
        }
    },
    org_name: {
        type: String,
        required: function() {
            return this.role === 'Organizer';
        }
    },
    nic: {
        type: String,
        required: function() {
            return this.role === 'Organizer';
        }
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['Admin', 'Organizer', 'User'],
        default: 'User'
    }
});

module.exports = mongoose.model('User', userSchema);
