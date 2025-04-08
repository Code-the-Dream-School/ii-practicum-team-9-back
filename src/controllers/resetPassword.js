const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../errors");
const emailOTP = require("../utils/sendEmail");

function generateOTP() {
  const min = 100000;
  const max = 999999;
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

const findUserByEmail = async (req, res) => {
  const { email: email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError(`User not found`);
  }

  const userId = user._id;
  const userEmail = user.email;
  globalThis.userId = userId;

  const newOTP = generateOTP();
  globalThis.newOTP = newOTP;
  emailOTP(userEmail, globalThis.newOTP);

  setTimeout(() => {
    globalThis.newOTP = null;
  }, 600000);

  res.status(StatusCodes.OK).json({
    user: { name: user.name },
    id: { _id: user.id },
  });
};

const validateOTP = async (req, res) => {
  const { code: OTPentered } = req.body;

  if (globalThis.newOTP === null) {
    throw new BadRequestError("Code has expired");
  } else if (OTPentered != globalThis.newOTP) {
    throw new BadRequestError("Code is invalid");
  }

  res.status(StatusCodes.OK).json({
    message: "Code validated",
    id: globalThis.userId,
  });
};

const resetPassword = async (req, res) => {
  const { password: newPassword } = req.body;
  const { id: id } = req.params;

  const user = await User.findOne({ _id: id });

  if (!user) {
    throw new NotFoundError(`User not found`);
  }
  if (globalThis.userId != id) {
    throw new UnauthenticatedError(
      `User unauthorized, please try password reset again`
    );
  }

  user.password = newPassword;
  user.save();

  res.status(StatusCodes.OK).json({
    user: { name: user.name },
    id: { _id: user.id },
  });
};

module.exports = {
  findUserByEmail,
  validateOTP,
  resetPassword,
};
