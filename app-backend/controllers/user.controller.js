const userService = require("../services/user.service");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const { fullname, email, password } = req.body;
  
  if (!fullname || !fullname.firstname || !fullname.lastname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await userService.hashPassword(password);

    const user = await userService.createUser({
      fullname: {
        firstname: fullname.firstname,
        lastname: fullname.lastname,
      },
      email,
      password: hashedPassword,
    });


    if (!user.generateAuthToken) {
      return res.status(500).json({ message: "Auth token method missing" });
    }

    const token = user.generateAuthToken();

    return res.status(201).json({ token, user });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.comparePassword) {
      return res.status(500).json({ message: "Password comparison method missing" });
    }
   

    const isMatch = await user.comparePassword(password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = user.generateAuthToken();

    return res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports.updateTasks = async (req, res) => {
  try {
    const userId = req.user._id; // JWT-authenticated user ID
    const taskUpdates = req.body;
    const photoFile = req.file; // File (if any) uploaded as form data

    if (!taskUpdates) {
      return res.status(400).json({ message: "No task updates provided" });
    }

    // Call the service to update tasks
    const updatedUser = await userService.updateTasks(userId, taskUpdates, photoFile);

    res.status(200).json({
      message: "Tasks updated successfully",
      streak: updatedUser.streak,
      tasks: updatedUser.tasks,
    });
  } catch (error) {
    console.error("Error updating tasks:", error.message);
    res.status(400).json({ error: error.message });
  }
};


module.exports.heightMeasure = async (req, res) =>
{
  try
  {
    const userId = req.user._id;
    const height = req.body.height;
    const updatedUser = await userService.heightMeasure(userId, height);
    res.status(200).json({message: "Height updated successfully", height: updatedUser.height});
  }
  catch(error)
  {
    console.error("Error updating height:", error.message);
    res.status(400).json({error: error.message});
  }
};

module.exports.weightMeasure = async(req, res) => {
  try {
    const userId = req.user._id;
    const weight = req.body.weight;
    const updatedUser = await userService.weightMeasure(userId, weight);
    res.status(200).json({ message: "Weight updated successfully", weight: updatedUser.weight });
  } catch (error) {
    console.error("Error updating weight:", error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports.genderPicker = async(req, res) => {
  try {
    const userId = req.user._id;
    const gender = req.body.gender;
    const updatedUser = await userService.genderPicker(userId, gender);
    res.status(200).json({ message:"Gender Update Succesfully", gender: updatedUser});
  }catch (error) {
    console.error("Error updating gender:", error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports.typePicker = async(req, res) => {
  try {
    const userId = req.user._id;
    const type = req.body.type;
    const updatedUser = await userService.typePicker(userId, type);
    res.status(200).json({ message:"Type Update Succesfully", type: updatedUser});
  }catch (error) {
    console.error("Error updating type:", error.message);
    res.status(400).json({ error: error.message });
  }
};