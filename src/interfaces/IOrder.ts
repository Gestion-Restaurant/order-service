import mongoose, { Document } from 'mongoose';
import {DeliveryStatus} from "../enums/deliveryStatusEnum";
import IOrderItem from "./IOrderItem";

interface IOrder extends Document {
    _id: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    restaurantId: mongoose.Types.ObjectId;
    items: IOrderItem[];
    status: DeliveryStatus;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}

export default IOrder;