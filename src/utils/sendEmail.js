const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
  debug: true,
});

async function emailOTP(email, OTP) {
  let message = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "One Time Passcode",
    text: `Your one time passcode is: ${OTP}. This code with expire in 10 minutes.`,
    html: `<b>Your one time passcode is: ${OTP}. This code with expire in 10 minutes.</b>`,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log(`message ${info.messageId} send status: ${info.response}`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = emailOTP;
