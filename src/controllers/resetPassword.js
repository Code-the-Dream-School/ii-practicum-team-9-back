const User = require("../models/User");
const OTP = require("../models/OTP");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const emailOTP = require("../utils/sendEmail");

const findUserByEmail = async (req, res) => {
  const { email: email } = req.body;
  const user = await User.findOne({ email });
  const OTPexpirationTime = 60000 * 10;

  if (!user) {
    throw new NotFoundError(`User not found`);
  }

  let otp = await OTP.findOne({ assignedTo: user._id });
  if (!otp) {
    otp = await OTP.create({ assignedTo: user._id });
  }

  try {
    const newOTP = otp.generateOTP();
    otp.updatedAt = Date.now();
    otp.expireAt = otp.updatedAt.getTime() + OTPexpirationTime;
    await otp.save();
    emailOTP(user.email, newOTP);
  } catch (error) {
    return error;
  }

  res.status(StatusCodes.OK).json({
    user: { name: user.name },
    id: { _id: user.id },
    message: "Email sent",
  });
};

const validateOTP = async (req, res) => {
  const { code: OTPentered, id: id } = req.body;
  const otpUser = await OTP.findOne({ assignedTo: id });

  if (!otpUser) {
    throw new NotFoundError("User not found");
  }
  if (OTPentered != otpUser.OTPcode) {
    throw new BadRequestError("Code is not valid");
  } else if (otpUser.expireAt < Date.now()) {
    throw new BadRequestError("Code has expired");
  }

  res.status(StatusCodes.OK).json({
    id: { userId: otpUser.assignedTo },
    message: "Code validated",
  });

  otpUser.OTPcode = null;
  otpUser.save();
};

const resetPassword = async (req, res) => {
  const { password: newPassword, id: id } = req.body;
  const user = await User.findOne({ _id: id });

  if (!newPassword) {
    throw new BadRequestError("Please provide a new password");
  }
  if (newPassword.length < 6) {
    throw new BadRequestError("Password must be at least 6 characters long");
  }
  if (!user) {
    throw new NotFoundError(`User not found`);
  }

  user.password = newPassword;
  user.save();

  res.status(StatusCodes.OK).json({
    user: { name: user.name },
    id: { _id: user.id },
    message: "Password was reset",
  });
};

module.exports = {
  findUserByEmail,
  validateOTP,
  resetPassword,
};
