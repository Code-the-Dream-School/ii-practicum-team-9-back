const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const { StatusCodes } = require("http-status-codes");

const createResponse = (status, message, data = []) => ({
  status,
  message,
  data,
});

const register = async (req, res) => {  
  try{
    
    const {name,email,password} = req.body;
    if (!name || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createResponse("error", "Please provide all fields"));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json(createResponse("error", "Email already exists"));
    }

    const user = await User.create({ name, email, password });
    const userProfile = new UserProfile({
      user: user._id,  
      role: 'user',  
      location: '',  
      profilePhoto: '',  
      interests: [],  
      tags: [],  
      bio: '',  
    });

    await userProfile.save();

    const token = user.createJWT();

    res
      .status(StatusCodes.CREATED)
      .json(
        createResponse("success", "User registered successfully", {
          name: user.name,
          id: user.id,
          token,
        })
      );
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(createResponse("error", "Please provide an email and password"));
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createResponse("error", "Invalid credentials"));
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(createResponse("error", "Invalid credentials"));
    }
     
    const token = user.createJWT();
    let userProfile = await UserProfile.findOne({ user: user._id });

    // Create a profile if one doesn't exist
    if (!userProfile) {
      userProfile = await UserProfile.create({
        user: user._id,
        role: 'user',
        location: '',
        profilePhoto: '',
        interests: [],
        tags: [],
        bio: '',
      });
    }

    res
      .status(StatusCodes.OK)
      .json(
        createResponse("success", "User logged in successfully", {
          name: user.name,
          id: user.id,
          token,
          profile: userProfile,
        })
      );
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createResponse("error", error.message));
  }
};


module.exports = {
  register,
  login,
};
