const cloudinary = require("cloudinary").v2;

// 🔧 Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📤 Upload function
const uploadToCloudinary = (buffer, folder = "ecommerce") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// ✅ Export
module.exports = {
  cloudinary,
  uploadToCloudinary,
};