require("dotenv").config();
const { PORT = 8000 } = process.env;
//const app = require("./app");
const app = require("./app");
const connectDB = require("./db/connect");

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
