import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config} from "../config/app.config";
import { BadRequestException } from "../utils/appError";
import { v4 as uuidv4 } from 'uuid';

export class FileService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: config.AWS_REGION,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  public async generatePresignedUrl(
    fileName: string,
    contentType: string,
    workspaceId: string,
    projectId: string,
    taskId?: string,
    commentId?: string,
  ): Promise<{ url: string; fileKey: string }> {
    try {
        // Create a unique file path: workspaceId/projectId/taskId/commentId/year/month/uuid-filename
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const uniqueId = uuidv4();
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");

        const fileKey = `${workspaceId}/${projectId}/${taskId ? taskId + '/' : ''}${commentId ? commentId + '/' : ''}${year}/${month}/${uniqueId}-${sanitizedFileName}`;
        
        // const fileKey = `${workspaceId}/${projectId}/${taskId}/${commentId}/${year}/${month}/${uniqueId}-${sanitizedFileName}`;

        const command = new PutObjectCommand({
            Bucket: config.AWS_S3_BUCKET_NAME,
            Key: fileKey,
            ContentType: contentType,
            // ACL: "public-read", // Optional: ONLY if you want files to be public. Ideally, keep them private.
        });

        const url = await getSignedUrl(this.s3Client, command, { expiresIn: 300 }); // URL expires in 5 minutes

        return { url, fileKey };
    } catch (error) {
        throw new BadRequestException("Failed to generate upload URL");
    }
  }
}
