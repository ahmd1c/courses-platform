import multer from "multer";
import path from "path";
import { Request } from "express";

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "public/images");
    } else if (file.fieldname === "video") {
      cb(null, "public/videos");
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "image" + "-" + Date.now() + path.extname(file.originalname));
    }

    if (file.fieldname === "video") {
      cb(null, "video" + "-" + Date.now() + path.extname(file.originalname));
    }
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.fieldname === "image") {
    if (
      !file.originalname.match(/\.(jpg|jpeg|png)$/) ||
      !file.mimetype.match(/\/(jpg|jpeg|png)$/)
    ) {
      return cb(new Error("Only image files are allowed!"));
    }
  } else if (file.fieldname === "video") {
    if (
      !file.originalname.match(/\.(mp4|mkv)$/) ||
      !file.mimetype.match(/\/(mp4|mkv)$/)
    ) {
      return cb(new Error("Only video files are allowed!"));
    }
  }
  cb(null, true);
};

export const upload = multer({
  storage: diskStorage,
  fileFilter,
});
