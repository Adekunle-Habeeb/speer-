require("dotenv").config();
const express = require("express");
const userRoute = require("./routes/userRoute");
const noteRoute = require("./routes/noteRoute");
const mongoose = require("mongoose");

const app = express();

mongoose.set("strict", false);
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 10000
})
  .then(() => {
    console.log("MongoDB is connected");

    // Start the server after the MongoDB connection is established
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(express.json());
app.use("/api/auth", userRoute);
app.use("/api", noteRoute);

module.exports = app;
