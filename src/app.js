const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");
const {createServer} =require('node:http');
const {Server} = require("socket.io");
const  Message = require("./models/Message");
const { Redis } = require("@upstash/redis");


UPSTASH_REDIS_REST_URL="https://subtle-kangaroo-17378.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AUPiAAIjcDFkM2EwYzM4YWQ2YzI0YWZhYTNhZTQxMDgwNGJjNzgxMXAxMA"

const redis = new Redis({
  url: UPSTASH_REDIS_REST_URL,
  token: UPSTASH_REDIS_REST_TOKEN,
});


const socket =createServer(app);
const io = new Server(socket,{
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const authenticateUser = require("./middleware/authentication");

const mainRouter = require("./routes/mainRouter.js");
const authRouter = require("./routes/authenticate");
const resetPasswordRouter = require("./routes/resetPassword");

const errorHandlerMiddleware = require("./middleware/error-handler");
const itemRoutes = require("./routes/itemRoutes.js");

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(favicon(__dirname + "/public/favicon.ico"));

app.use("/api/v1", mainRouter);
app.use("/auth", authRouter);
app.use("/reset", resetPasswordRouter);
app.use("/api/v1/items", authenticateUser, itemRoutes);

app.use(errorHandlerMiddleware);
io.on("connection", (socket) => {  
  socket.on("send-message", async (data) => {
    const { from:message_from, to:message_to, message:content } = data;
    const message = new Message({ message_from, message_to, content });
    await message.save();
    socket.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("register",async (userId) =>{
    await redis.set(`user:${userId}`, socket.id);
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  })

  socket.on("private_message",async(data) =>{
    console.log("data",data);
    const { message_from, message_to, message:content } = data;    
    const socketId = await redis.get(`user:${message_to}`);    
    if (socketId){
      const message = new Message({ message_from, message_to, content });
      const result = await message.save();
      console.log("message saved");
      console.log("result",result)
      io.to(socketId).emit("private_message", result);
      return;
    }
    else{
      console.log(`User ${message_to} not found`);
    }
  })

  
});
//app.use("/products", authenticateUser, productsRouter);

module.exports = socket;
//module.exports = app;
