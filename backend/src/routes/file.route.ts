import { Router } from "express";
import { FileController } from "../controllers/file.controller";

const fileRouter = Router();
const fileController = new FileController();

fileRouter.get(
  "/presigned-url",
  fileController.getPresignedUrl
);

export default fileRouter;
