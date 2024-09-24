import { Request } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: any) {
    const allowedFile = ["image/jpg", "image/jpeg", "image/png"];
    if (!allowedFile.includes(file.mimetype)) {
      cb(new Error("this type of file is not supported"));
      return;
    }
    cb(null, "./src/storage");
  },
  filename: function (req: Request, file: Express.Multer.File, cb: any) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
export { multer, storage };
