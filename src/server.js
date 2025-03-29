require("dotenv").config();
const { PORT = 8000 } = process.env;
const app = require("./app");

// const listener = () => console.log(`Listening on Port ${PORT}!`);
// app.listen(PORT, listener);

//connect DB
const connectDB = require("./db/connect");
//mongo_URI from .env file
let mongoURL = process.env.MONGO_URI;

const start = async () => {
  try {
    await connectDB(mongoURL);
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
