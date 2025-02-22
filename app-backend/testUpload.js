const cloudinary = require("cloudinary").v2;

// Configure Cloudinary (replace with your credentials)
cloudinary.config({
  cloud_name: "du2pijo5y",
  api_key: "217914345467954",
  api_secret: "DBIhe2ZZi9YiLZ-ATzqTtelrR4c",
});

// Upload a test image (replace the path with the actual path to a valid image)
cloudinary.uploader.upload("C:\\Users\\athar\\Downloads\\logo.png", { folder: "uploads" }, (error, result) => {
    if (error) {
      console.error("Manual upload failed:", error);
    } else {
      console.log("Manual upload result:", result);
    }
  });
  