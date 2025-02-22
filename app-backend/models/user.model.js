const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false,
  },
  startdate: {
    type: Date,
    default: Date.now,
  },
  streak: {
    type: Number,
    default: 0,
  },
  tasks: {
    task1: {
      type: Number,
      default: 0,
      max: 6,
    },
    task2: {
      workoutsCompleted: {
        type: Number,
        default: 0,
        max: 3,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
    task3: {
      type: Boolean,
      default: false,
    },
    task4: {
      type: String, // Book review text
      default: "",
    },
    task5: {
      imageUrl: { type: String, default: "" },
      uploaded: { type: Boolean, default: false },
    },
  },
  lastUpdatedDate: {
    type: Date,
    default: null,
  },
});


userSchema.methods.generateAuthToken = function () {
  const token = jsonwebtoken.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.hashPassword = async function (password) {
  this.password = await bcrypt.hash(password, 10);
};


const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
