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
  let messages = await Message.find({$or:[{ message_to: id },{ message_from: id }]})
                  .populate("message_to","name")
                  .populate("message_from","name")
                  .sort({"createdAt":1})
                  ;


   res.status(StatusCodes.OK).json(
    createResponse("success", "Message retrieved successfully", {      
      data: { messages },
    }));
}

module.exports = {
  getMessageByUser,
};
