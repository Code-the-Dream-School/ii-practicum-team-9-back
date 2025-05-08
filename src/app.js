const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");
const profilePhotoRoutes = require("./routes/uploadProfilePhoto.js");
const userRoutes = require('./routes/userRoutes'); 
const {createServer} =require('node:http');
const {Server} = require("socket.io");
const  Message = require("./models/Message");
const {Redis} = require("@upstash/redis");
const path = require("path");

const socket = createServer(app);
const io = new Server(socket, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const redis = new Redis({
  url: process.env.REDIS_SERVER,
  token: process.env.REDIS_TOKEN,
})
const authenticateUser = require("./middleware/authentication");

const mainRouter = require("./routes/mainRouter.js");
const authRouter = require("./routes/authenticate");
const resetPasswordRouter = require("./routes/resetPassword");
const barterRouter = require("./routes/barter");
 
const itemRoutes = require("./routes/itemRoutes.js");
 
const likeRouter = require("./routes/like");
const messagesRouter = require("./routes/messages");

const errorHandlerMiddleware = require("./middleware/error-handler");
 
app.use(cors());
app.use(express.json());
const publicFolder = process.env.NODE_ENV === "production"?"dist":"public";

app.use(express.static(path.join(__dirname,publicFolder)));

app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(favicon(__dirname + "/public/favicon.ico"));

app.use("/api/v1", mainRouter);
app.use("/auth", authRouter);
app.use("/reset", resetPasswordRouter);
app.use('/api/profile', userRoutes);
app.use("/api/items", authenticateUser, itemRoutes);
app.use('/api/profile', profilePhotoRoutes);

 
app.use("/api/v1/barter", authenticateUser, barterRouter);
app.use("/api/v1/like", authenticateUser, likeRouter);
app.use("/api/v1/messages", authenticateUser, messagesRouter);

app.use(errorHandlerMiddleware);

io.on("connection", (socket) => {
  socket.on("disconnect", async () => {
    try{
      const userId = await redis.get(`socket:${socket.id}`); 
      if (userId){
        await redis.del(`user:${userId}`);
        await redis.del(`socket:${socket.id}`);
        console.log(`user ${socket.id} disconnected (Socket ID: ${socket.id})`);
      }
    }
    catch(error){
      console.error("Error in disconnect listener:", error);
    }
  });

  socket.on("register",async (userId) =>{
    try{
      await redis.set(`user:${userId}`, socket.id,{EX: 60*60}); //1 hour expiration
      await redis.set(`socket:${socket.id}`, userId,{EX: 60*60}); //1 hour expiration
      console.log("User registered", userId, socket.id);
    } catch(error){
      console.error("Error in register listener:", error);
    }
  })

  socket.on("private-message", async (data) => {
    try{
      const { message_from, message_to, message } = data;
      const receiverSocketId = await redis.get(`user:${message_to}`);

      if (receiverSocketId && io.sockets.sockets.get(receiverSocketId)) {
        const messageNew = new Message({ message_from, message_to, message });
        await messageNew.save();
        io.to(receiverSocketId).emit("private-message", messageNew);
        console.log("Message sent to", receiverSocketId);
      }
      else{
        console.log("User not online", message_to);
      }
    }
    catch(error){
      console.error("Error in private-message listener:", error);
    }
  });
});

module.exports = socket;
//module.exports = app;
