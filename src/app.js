const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");
const {createServer} =require('node:http');
const {Server} = require("socket.io");

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

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(favicon(__dirname + "/public/favicon.ico"));

app.use("/api/v1", mainRouter);
app.use("/auth", authRouter);
app.use("/reset", resetPasswordRouter);

app.use(errorHandlerMiddleware);
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("register", (data) => {
    console.log("Socket Id", socket.id);
    console.log(data);
  });

  socket.on("chat-message", (data) => {
    console.log(data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  
});
//app.use("/products", authenticateUser, productsRouter);

module.exports = socket;
//module.exports = app;
