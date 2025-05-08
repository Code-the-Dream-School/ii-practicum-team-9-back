const User = require("../models/User");
const OTP = require("../models/OTP");
const { StatusCodes } = require("http-status-codes");
const emailOTP = require("../utils/sendEmail");

const createResponse = (status, message, data = []) => ({
  status,
  message,
  data,
});

const findUserByEmail = async (req, res) => {
  try {
    const { email: email } = req.body;
    const OTPexpirationTime = 60000 * 10;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "User not found"));
    }

    let otp = await OTP.findOne({ assignedTo: user._id });
    if (!otp) {
      otp = await OTP.create({ assignedTo: user._id });
    }

    const newOTP = otp.generateOTP();
    otp.updatedAt = Date.now();
    otp.expireAt = otp.updatedAt.getTime() + OTPexpirationTime;
    await otp.save();
    emailOTP(user.email, newOTP);

    res.status(StatusCodes.OK).json(
      createResponse("success", "Email was sent", {
        userName: user.name,
        email: user.email,
        id: user._id,
      })
    );
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

const validateOTP = async (req, res) => {
  try {
    const { code: OTPentered, id: id } = req.body;
    const otpUser = await OTP.findOne({ assignedTo: id });

    if (!otpUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "User not found"));
    }
    if (OTPentered != otpUser.OTPcode) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createResponse("error", "Code is not valid"));
    }
    if (otpUser.expireAt < Date.now()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createResponse("error", "Code has expired"));
    }

    res.status(StatusCodes.OK).json(
      createResponse("success", "Code validated", {
        userId: otpUser.assignedTo,
      })
    );

    otpUser.OTPcode = null;
    await otpUser.save();
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password: newPassword, id: id } = req.body;
    const user = await User.findOne({ _id: id });

    if (!newPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createResponse("error", "Please provide a new password"));
    }
    if (newPassword.length < 6) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          createResponse("error", "Password must be at least 6 characters long")
        );
    }
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(createResponse("error", "User not found"));
    }

    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json(
      createResponse("success", "Password was reset", {
        userName: user.name,
        userId: user.id,
      })
    );
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};

module.exports = {
  findUserByEmail,
  validateOTP,
  resetPassword,
};
