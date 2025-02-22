const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectToDb = require("./db/db");
const userRouter = require("./routes/user.route");
require("./corn");
const bodyParser = require("body-parser");


connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Ensure this is present

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/user", userRouter);

module.exports = app;
