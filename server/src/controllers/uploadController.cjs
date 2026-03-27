const { uploadToCloudinary } = require("../config/cloudinary.cjs");

// 📤 Upload single image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "ecommerce/products"
    );

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// 📤 Upload multiple images
const uploadMultiple = async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const results = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file.buffer, "ecommerce/products")
      )
    );

    res.json(
      results.map((r) => ({
        url: r.secure_url,
        publicId: r.public_id,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ EXPORT
module.exports = {
  uploadImage,
  uploadMultiple,
};