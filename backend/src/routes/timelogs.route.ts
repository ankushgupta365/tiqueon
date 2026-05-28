import { Router } from "express";
import {
    getTimeLogsByTask
} from "../controllers/timelogs.controller";

const timelogsRoutes = Router();

timelogsRoutes.post(
  "/project/:projectId/workspace/:workspaceId/task/:taskId/create",
  createTimelogController
);

timelogsRoutes.delete("/:id/workspace/:workspaceId/task/:taskId/delete", deleteTimeLogController);

timelogsRoutes.put(
  "/:id/project/:projectId/workspace/:workspaceId/task/:taskId/update",
  updateTimeLogController
);

timelogsRoutes.get("/workspace/:workspaceId/project/:projectIdall", getAllTimeLogsController);

timelogsRoutes.get(
  "/:id/project/:projectId/workspace/:workspaceId/task/:taskId",
  getTimeLogsByTask
);

export default timelogsRoutes;
