const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Received Authorization Header:", req.headers.authorization);
    console.log("Extracted Token:", token);

    if (!token) {
      console.error("No token provided in the request.");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await userModel.findById(decoded._id);
    console.log("User Retrieved from Database:", user);

    if (!user) {
      console.error("No user found for the provided token.");
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user; // Attach the user to the request object for downstream use
    console.log("User attached to req object:", req.user);

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error during token verification or user retrieval:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
