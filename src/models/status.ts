import mongoose, { Document, Schema } from 'mongoose';

export interface IStatus extends Document {
    code: string;
}

const StatusSchema: Schema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    }
});

export default mongoose.model<IStatus>('Status', StatusSchema);
