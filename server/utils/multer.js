import multer from "multer";
import path from "path";

const uploadMultiple = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, files, cb) {
    checkFileType(files, cb);
  },
}).array("image", 12);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: async function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");

const checkFileType = (file, cb) => {
  // If files is not an array, create an array with a single file
  const filesArray = Array.isArray(file) ? file : [file];

  //   console.log(filesArray, "making an array");
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;

  // Check each file in the array
  const allFilesValid = filesArray.every((file) => {
    // Check ext
    console.log("checking file type");
    const extName = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    // Check mime
    console.log("checking mime");
    const mimeType = fileTypes.test(file.mimetype);
    console.log("checked the mime type successfully");
    return mimeType && extName;
  });
  console.log(allFilesValid, "all files valid");
  if (allFilesValid) {
    return cb(null, true);
  } else {
    cb("Error: Images Only !!!");
  }
};

export { uploadMultiple, upload };
