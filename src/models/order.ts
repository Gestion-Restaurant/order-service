import { Schema, model, Document, Types } from 'mongoose';
import { IStatus } from './status';

export interface IOrder extends Document {
    orderDate: Date;
    total: number;
    status: Types.ObjectId | IStatus;
    customerId: number;
    kitchenId: number;
    deliverId: number;
}

const orderSchema = new Schema<IOrder>({
    orderDate: {
        type: Date,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: 'Status',
        required: true,
    },
    customerId: {
        type: Number,
        required: true,
    },
    kitchenId: {
        type: Number,
        required: true,
    },
    deliverId: {
        type: Number,
        required: true,
    }
});

export const Order = model<IOrder>('Order', orderSchema);
