import mongoose from 'mongoose';
import IOrder from '../interfaces/IOrder';
import {DeliveryStatus} from "../enums/deliveryStatusEnum";

const orderSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    items: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    status: {
        type: String,
        enum: Object.values(DeliveryStatus),
        default: DeliveryStatus.PENDING
    },
    totalAmount: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.model<IOrder>('Order', orderSchema);