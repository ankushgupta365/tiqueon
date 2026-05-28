import mongoose from "mongoose";

export interface TimeLogDocument extends Document{
    date: Date; //date for which time is logged
    duration: number; // duration in minutes
    title: string;
    description: string | null;
    task: mongoose.Types.ObjectId;
    project: mongoose.Types.ObjectId;
    workspace: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const timeLogSchema = new mongoose.Schema<TimeLogDocument>(
    {
        date: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: null,
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
            required: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,   
    }
);

const TimeLogModel = mongoose.model<TimeLogDocument>("TimeLog", timeLogSchema);
export default TimeLogModel;