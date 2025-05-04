const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const Message = require("../models/Message");

const createResponse = (status, message, data = []) => ({
  status,
  message,
  data,
});


const getMessageByUser= async (req,res)=>{
  let currentUser = req.user;
  let id = currentUser._id;
  let messages = await Message.find({ message_from: id })
                  .populate("message_to","name")
                  .populate("message_from","name");
  
  console.log("messages", messages);
  

   res.status(StatusCodes.OK).json(
    createResponse("success", "Message retrieved successfully", {
      message: "Message retrieved successfully",
      data: { messages },
    })
      );
}

module.exports = {
  getMessageByUser,
};
