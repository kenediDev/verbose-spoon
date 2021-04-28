import { Request } from "express";
import multer, { Multer, StorageEngine } from "multer";
import path from "path";

export class Multer_ {
  constructor() {}

  async upload(): Promise<Multer> {
    const storage: StorageEngine = multer.diskStorage({
      filename: function (req: Request, file, cb) {
        cb(
          null,
          `${file.originalname.replace(".", "")}.${file.mimetype.split("/")[1]}`
        );
      },
      destination: function (req: Request, file, cb) {
        cb(null, path.join(__dirname, "../media"));
      },
    });
    return multer({ storage });
  }
}
