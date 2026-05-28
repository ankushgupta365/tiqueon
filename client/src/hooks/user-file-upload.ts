import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { getPresignedUrlMutationFn } from "@/lib/api"; // ✅ Use the correctly named function
import { useFileUploadProps } from "@/types/api.type";

// interface UploadedFile {
//   file: File | undefined;
//   id: string;
//   name: string;
//   type: string;
//   size: number;
//   url?: string;
//   thumbnailUrl?: string;
// }

// The shape of the final object after a successful upload
export interface UploadResult {
  originalName: string;
  fileKey: string;
  url: string; // The final public/accessible URL of the file
  size: number;
  type: string;
}

/**
 * A hook to manage the two-step file upload process to S3 via presigned URLs.
 * 1. Fetches a secure presigned URL from our backend.
 * 2. Uploads the file directly to that S3 URL from the client.
 */
export const useFileUpload = ({
  workspaceId,
  projectId,
  taskId,
  commentId,
}: useFileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  // ✅ Mutation is defined once here, but only CALLED inside uploadFiles.
  const getPresignedUrl = useMutation({
    mutationFn: getPresignedUrlMutationFn,
    onError: (error) => {
      // This will catch errors from your backend API if it fails to generate a URL
      toast({
        title: "URL Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  /**
   * Uploads a file directly to the S3 presigned URL.
   * We use `fetch` to avoid sending app-specific headers (like Bearer tokens) to AWS.
   */
  const uploadToS3 = async (file: File, presignedUrl: string) => {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`S3 Upload Failed for ${file.name}`);
    }
  };

  /**
   * The main function exposed by the hook. It orchestrates the entire upload flow.
   * @param files An array of File objects to upload.
   * @returns A promise that resolves to an array of UploadResult objects.
   */
  const uploadFiles = async (files: File[]): Promise<UploadResult[]> => {
    if (files.length === 0) return [];
    
    setIsUploading(true);
    console.log("Starting upload for files:", files);
    try {
      // Process all file uploads in parallel for maximum speed.
      const uploadPromises = files.map(async (file) => {
        // Step 1: Get the presigned URL from your backend for this specific file.
        // We use `mutateAsync` to get a promise we can `await`.
        const { url: presignedUrl, fileKey } = await getPresignedUrl.mutateAsync({
          fileName: file.name,
          contentType: file.type,
          workspaceId,
          projectId,
          taskId,
          commentId,
        });

        // Step 2: Upload the actual file to the URL S3 gave us.
        await uploadToS3(file, presignedUrl);

        // Step 3: Construct the final, permanent URL of the file for storage in your database.
        const bucketUrl = `https://${import.meta.env.VITE_AWS_S3_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com`;
        const finalUrl = `${bucketUrl}/${fileKey}`;

        return {
          originalName: file.name,
          fileKey,
          url: finalUrl,
          size: file.size,
          type: file.type,
        };
      });

      // Wait for all the parallel uploads to complete.
      const results = await Promise.all(uploadPromises);
      return results;

    } catch (error) {
      console.error("File upload orchestration failed:", error);
      toast({
        title: "Upload Failed",
        description: "One or more attachments could not be uploaded.",
        variant: "destructive",
      });
      // Re-throw to let the calling function know it failed.
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFiles,
    isUploading,
  };
};
