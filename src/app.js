const express = require("express");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");

//user authentication
const authenticateUser = require("./middleware/authentication");

//routers
const authRouter = require("./routes/authenticate");

const mainRouter = require("./routes/mainRouter.js");

// middleware
app.use(cors());
app.use(express.json());

//middleware to connect to public front end directory - possibly will need to rename with team
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/favicon.ico"));

// routes
app.use("/api/v1", mainRouter);
//new auth route for login and register
app.use("/auth", authRouter);

//authenticateUser middleware will be used once user logs into account, calling "products" for now, but need router name for when user accesses products/account
//app.use("/products", authenticateUser, productsRouter);

module.exports = app;
