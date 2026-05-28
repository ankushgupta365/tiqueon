import mongoose, { Document, Schema } from "mongoose";


export interface FileDocument extends Document{
    filename: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedBy: mongoose.Types.ObjectId;
    comment: mongoose.Types.ObjectId | null;
    task: mongoose.Types.ObjectId | null;
    project: mongoose.Types.ObjectId | null;
    workspace: mongoose.Types.ObjectId;
    initial: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const fileSchema = new Schema<FileDocument>(
    {
        filename: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
            trim: true,
        },
        fileType: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            required: true,
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
        task: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            default: null,
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            default: null,
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        initial: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,       
    }
);

const FileModel = mongoose.model<FileDocument>("File", fileSchema);
export default FileModel;