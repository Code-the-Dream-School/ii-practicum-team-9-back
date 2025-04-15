const mongoose = require("mongoose");
const otpGenerator = require("otp-generator");

const OTPSchema = new mongoose.Schema(
  {
    OTPcode: {
      type: String,
      minlength: 6,
      maxlength: 6,
    },
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    expireAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

OTPSchema.methods.generateOTP = function () {
  const OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  this.OTPcode = OTP;
  return this.OTPcode;
};

module.exports = mongoose.model("OTP", OTPSchema);
