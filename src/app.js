const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");

const authenticateUser = require("./middleware/authentication");

const mainRouter = require("./routes/mainRouter.js");
const authRouter = require("./routes/authenticate");
const resetPasswordRouter = require("./routes/resetPassword");

const errorHandlerMiddleware = require("./middleware/error-handler");
const itemRoutes = require("./routes/itemRoutes.js");
const resetPasswordRouter = require("./routes/resetPassword");
const itemRoutes = require("./routes/itemRoutes.js");

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
app.use("/api/items", itemRoutes);

//app.use("/products", authenticateUser, productsRouter);

module.exports = app;
