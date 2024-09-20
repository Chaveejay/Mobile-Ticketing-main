// services/twilioService.js
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendOtpSms = (phoneNumber, otp) => {
    return client.messages.create({
        body: `Your OTP code is ${otp}`,
        from: twilioPhoneNumber,
        to: phoneNumber
    });
};

module.exports = { sendOtpSms };

