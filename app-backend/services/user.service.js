const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports.createUser = async ({ fullname, email, password }) => {
  if (!fullname.firstname || !fullname.lastname || !email || !password) {
    throw new Error("All fields are required");
  }

  const user = await userModel.create({
    fullname,
    email,
    password,
  });

  return user;
};


module.exports.findUserByEmail = async (email) => {
  return await userModel.findOne({ email }).select("+password");
};

module.exports.getUserById = async (userId) => {
  return await userModel.findById(userId);
};

module.exports.updateTasks = async (userId, taskUpdates, photoFile) => {
  try {

    await userModel.updateMany(
      { "tasks.task5": { $type: 8 } }, // 8 is the MongoDB type for boolean
      { $set: { "tasks.task5": { imageUrl: "", uploaded: false } } }
    );

    
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    // Prevent multiple updates in the same day
    const today = new Date().toISOString().slice(0, 10);
    const lastUpdated = user.lastUpdatedDate ? user.lastUpdatedDate.toISOString().slice(0, 10) : null;
    if (lastUpdated === today) throw new Error("Tasks already updated today");

    // Ensure task2 is properly structured
    if (typeof user.tasks.task2 !== "object" || user.tasks.task2 === null) {
      user.tasks.task2 = { workoutsCompleted: 0, completed: false };
    }

    // Ensure task5 is initialized as an object
if (typeof user.tasks.task5 !== "object" || user.tasks.task5 === null) {
  user.tasks.task5 = { imageUrl: "", uploaded: false };
}


    // Safely update tasks
    user.tasks.task1 = Math.min((user.tasks.task1 || 0) + (Number(taskUpdates.task1) || 0), 1);
    user.tasks.task2.workoutsCompleted = Math.min(
      (user.tasks.task2.workoutsCompleted || 0) + (Number(taskUpdates.task2) || 0),
      3
    );
    user.tasks.task2.completed = user.tasks.task2.workoutsCompleted >= 3;
    user.tasks.task3 = taskUpdates.task3 ?? user.tasks.task3; // Task 3 is a boolean
    user.tasks.task4 = taskUpdates.task4 || user.tasks.task4; // Task 4 is a string (book review)

    // Handle photo upload for task5
    if (photoFile) {
      try {
        const result = await cloudinary.uploader.upload_stream( {
          folder: "uploads",
        });
        console.log("Cloudinary upload result:", result);
        user.tasks.task5.imageUrl = result.secure_url;
        user.tasks.task5.uploaded = true;
        result.end(photoFile.buffer);
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw new Error("Photo upload failed: " + error.message);
      }
      
    }
    // Set last updated date
    user.lastUpdatedDate = new Date();

    // Check if all tasks are completed
    const allTasksCompleted =
      user.tasks.task1 === 1 &&
      user.tasks.task2.completed &&
      user.tasks.task3 === true &&
      user.tasks.task4 &&
      user.tasks.task5?.uploaded;

    // Update streak based on task completion
    if (allTasksCompleted) {
      user.streak += 1;
    } else {
      user.streak = 0;
    }

    // Save the user and return the updated user object
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Error updating tasks: " + error.message);
  }
};


module.exports.heightMeasure = async (userId, height) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    user.height = height;
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Error updating height: " + error.message);
  }
}


module.exports.weightMeasure = async (userId, weight) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    user.weight = weight;
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Error updating weight: " + error.message);
  }
}

module.exports.genderPicker = async (userId, gender) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    user.gender = gender;
    await user.save();
    return user;
} catch (error){
  throw new Error("Error updating Gender: " + error.message);
}
}

module.exports.typePicker = async (userId, type) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    user.type = type;
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Error updating type: " + error.message);
  }
};