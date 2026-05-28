import mongoose, { Document, Schema } from "mongoose";

export interface TaskHistoryDocument extends Document {
    task: mongoose.Types.ObjectId;
    changedBy: mongoose.Types.ObjectId;
    changeType: string;
    previousValue: any;
    newValue: any;
    createdAt: Date;
    updatedAt: Date;
}

const taskHistorySchema = new Schema<TaskHistoryDocument>(
    {
        task: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        changedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        changeType: {
            type: String,
            required: true,
        },
        previousValue: {
            type: Schema.Types.Mixed,
            default: null,
        },
        newValue: {
            type: Schema.Types.Mixed,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const TaskHistoryModel = mongoose.model<TaskHistoryDocument>(
    "TaskHistory",
    taskHistorySchema
);
export default TaskHistoryModel;    