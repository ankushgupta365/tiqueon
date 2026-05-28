import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { FileService } from "../services/file.service";
import { HTTPSTATUS } from "../config/http.config";
import { BadRequestException } from "../utils/appError";

export class FileController {
    private fileService: FileService;

    constructor() {
        this.fileService = new FileService();
    }

    public getPresignedUrl = asyncHandler(async (req: Request, res: Response) => {
        const { fileName, contentType, workspaceId, projectId, taskId, commentId } = req.query;

        if (!fileName || !contentType || !workspaceId) {
            throw new BadRequestException("Missing required parameters: fileName, fileType, workspaceId, userId, projectId or taskId");
        }

        const { url, fileKey } = await this.fileService.generatePresignedUrl(
            String(fileName),
            String(contentType),
            String(workspaceId),
            String(projectId),
            taskId ? String(taskId) : undefined,
            commentId ? String(commentId) : undefined,
        );

        return res.status(HTTPSTATUS.OK).json({
            message: "Presigned URL generated successfully",
            url,
            fileKey,
        });
    });
}
