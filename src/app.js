const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const Message = require("./models/Message");

const socket = createServer(app);
const io = new Server(socket, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const authenticateUser = require("./middleware/authentication");

const mainRouter = require("./routes/mainRouter.js");
const authRouter = require("./routes/authenticate");
const resetPasswordRouter = require("./routes/resetPassword");
const itemRoutes = require("./routes/itemRoutes.js");
const barterRouter = require("./routes/barter");
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
app.use("/api/v1/items", authenticateUser, itemRoutes);
app.use("/api/v1/barter", authenticateUser, barterRouter);

app.use(errorHandlerMiddleware);

io.on("connection", (socket) => {
  socket.on("send-message", async (data) => {
    const { from: message_from, to: message_to, message: content } = data;
    const message = new Message({ message_from, message_to, content });
    await message.save();
    socket.emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

module.exports = socket;
//module.exports = app;
