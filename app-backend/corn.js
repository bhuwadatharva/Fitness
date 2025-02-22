const cron = require("node-cron");
const moment = require("moment");
const userModel = require("./models/user.model");

// Schedule the task to run at 11:30 PM every day
cron.schedule("55 23 * * *", async () => {
  console.log("Running the task reset job at 11:30 PM");

  try {
    const today = moment().startOf("day"); // Start of today (midnight)
    const users = await userModel.find(); // Get all users

    // Loop through each user and check lastUpdatedDate
    for (let user of users) {
      const lastUpdatedDate = user.lastUpdatedDate
        ? moment(user.lastUpdatedDate)
        : null;

      // If lastUpdatedDate is not today, reset streak and tasks
      if (!lastUpdatedDate || !lastUpdatedDate.isSame(today, "day")) {
        await userModel.findByIdAndUpdate(user._id, {
          $set: {
            "tasks.task1": false,
            "tasks.task2": false,
            "tasks.task3": false,
            "tasks.task4": false,
            "tasks.task5": false,
            lastUpdatedDate: null, // Reset the last updated date
            streak: 0, // Reset streak to 0
          },
        });
      }

      // If lastUpdatedDate is today, reset tasks to false (without affecting streak)
      if (lastUpdatedDate && lastUpdatedDate.isSame(today, "day")) {
        await userModel.findByIdAndUpdate(user._id, {
          $set: {
            "tasks.task1": false,
            "tasks.task2": false,
            "tasks.task3": false,
            "tasks.task4": false,
            "tasks.task5": false,
          },
        });
      }
    }

    console.log(
      "Streaks and tasks have been reset for users whose last update was not today, and tasks have been reset for users whose last update is today."
    );
  } catch (error) {
    console.error("Error resetting streak and tasks: " + error.message);
  }
});
