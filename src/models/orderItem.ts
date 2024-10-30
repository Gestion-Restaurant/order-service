import {Schema, Types} from "mongoose";
import {IOrder} from "./order";

export interface IOrderItem {
    orderId: Types.ObjectId | IOrder;
    itemId: number;
    quantity: number;
    price: number;
}

const orderItemSchema = new Schema<IOrderItem>({
    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    },
    itemId: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
})