import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3002,
    customerServiceUrl: process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3000',
    kitchenServiceUrl: process.env.KITCHEN_SERVICE_URL || 'http://localhost:3001',
    ordersServiceUrl: process.env.ORDERS_SERVICE_URL || 'http://localhost:3002',
    deliveryServiceUrl: process.env.DELIVERY_SERVICE_URL || 'http://localhost:3003',
};