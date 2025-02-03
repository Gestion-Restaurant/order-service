import mongoose, { Document } from 'mongoose';
import { DeliveryStatus } from '../enums/deliveryStatusEnum';

interface IDelivery extends Document {
    _id: string;
    deliveryPersonId: string;
    clientId: string;
    orderId: string;
    status: DeliveryStatus;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

export default IDelivery;