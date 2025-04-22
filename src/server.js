const dotenv = require("dotenv");
const connectDB = require("./db/connect");

dotenv.config();

const app = require("./app.js");

// MongoDB connection
const mongoURL = process.env.MONGO_URI || "mongodb://localhost:27017/barterDB";

const start = async () => {
  try {
    await connectDB(mongoURL);
    console.log("MongoDB connected successfully!");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

start();
