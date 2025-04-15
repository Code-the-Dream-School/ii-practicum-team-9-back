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
    text: `Your one time passcode is: ${OTP}. This code with expire in 10 minutes. 
    Go to this link to enter passcode and reset your password: ${process.env.BASE_URL}/reset/validateCode`,
    html: `<b>Your one time passcode is: ${OTP}. This code with expire in 10 minutes. 
    Click <a href="${process.env.BASE_URL}/reset/validateCode" target="_blank">here </a> to enter your passcode and reset your password.</b>`,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log(`message ${info.messageId} send status: ${info.response}`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = emailOTP;
