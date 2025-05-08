const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_photos", 
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
    resource_type: "image",
    format: "jpg",
    public_id: (req, file) => `profile-${Date.now()}-${file.originalname.split('.')[0]}`
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("File must be an image"), false);
    }
    cb(null, true);
  }
});

module.exports = upload;

