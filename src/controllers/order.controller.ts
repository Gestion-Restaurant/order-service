import { Request, Response } from 'express';
import IOrder from "../interfaces/IOrder";
import Order from "../models/orderSchema";
import {DeliveryStatus} from "../enums/deliveryStatusEnum";
import {config} from "../conf/config";
import axios from 'axios';
import IOrderCustomer from '../interfaces/IOrderCustomer';
import IDelivery from '../interfaces/IDelivery';
import IUser from '../interfaces/userInterface';


export const getAllOrders = async (req: Request, res: Response): Promise<Response> => {
    try {
        const orders: IOrder[] = await Order.find();
        return res.status(200).json({
            message: 'Commandes récupérées avec succès',
            data: orders,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            error
        });
    }
};

export const getOrdersByRestaurantId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { restaurantId } = req.params;
        // get the orders that have the same restaurantId and the status DeliveryStatus.PENDING or in IN_KITCHEN
        const ordersData = await Order.find({
            restaurantId,
            status: {
                $in: [DeliveryStatus.PENDING, DeliveryStatus.IN_KITCHEN, DeliveryStatus.READY_FOR_DELIVERY, DeliveryStatus.ASSIGNED]
            }
        }).lean();
        
        const orders: IOrderCustomer[] = ordersData.map(order => ({
            ...order,
            customerName: ''
        } as unknown as IOrderCustomer));

        if (!orders) {
            return res.status(404).json({
                message: 'Commandes non trouvées',
            });
        }

        for (const order of orders) {
            const response = await axios.get(`${config.customerServiceUrl}/users/byId/${order.clientId.toString()}`);
            if (response.status === 200) {
                order.customerName = response.data.customer.name;
            } else {
                order.customerName = '';
            }
        }

        return res.status(200).json({
            message: 'Commandes récupérées avec succès',
            data: orders,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            error
        });
    }
};

export const getOrderById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const order: IOrder | null = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                message: 'Commande non trouvée',
            });
        }
        return res.status(200).json({
            message: 'Commande récupérée avec succès',
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            error
        });
    }
};

export const getOrdersByClientId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { clientId } = req.params;
        const ordersData: IOrder[] = await Order.find({ clientId, status: { $ne: DeliveryStatus.DELIVERED } }).lean();


        const orders: IOrderCustomer[] = ordersData.map(order => ({
            ...order,
            customerName: ''
        } as unknown as IOrderCustomer));

        if (!orders) {
            return res.status(404).json({
                message: 'Commandes non trouvées',
            });
        }

        for (const order of orders) {
            const response = await axios.get(`${config.customerServiceUrl}/users/byId/${clientId}`);
            if (response.status === 200) {
                order.customerName = response.data.customer.name;
            } else {
                order.customerName = '';
            }
        }

        return res.status(200).json({
            message: 'Commandes récupérées avec succès',
            data: orders,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            error
        });
    }
}

export const createOrder = async (req: Request, res: Response): Promise<Response> => {
    try {
        const order: IOrder = new Order(req.body);
        const pendingOrder = await Order.findOne({ clientId: order.clientId, status: { $ne: DeliveryStatus.DELIVERED } });
        const client: IUser = await axios.get(`${config.customerServiceUrl}/users/byId/${order.clientId.toString()}`);
        if (pendingOrder) {
            return res.status(400).json({
                message: 'Vous avez déjà une commande en cours',
            });
        }
        const newOrder: IOrder = await order.save();
        // create in the deliveryService a new deliveryObject
        const delivery = {
            deliveryPersonId: undefined,
            clientId: newOrder.clientId.toString(),
            orderId: newOrder._id.toString(),
            status: DeliveryStatus.PENDING,
            address: client.address ?? '',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        await axios.post(`${config.deliveryServiceUrl}/deliveries`, delivery);

        return res.status(201).json({
            message: 'Commande créée avec succès',
            data: newOrder,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Erreur serveur',
            error,
        });
    }
}

export const updateOrderById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const updatedOrder: IOrder | null = await Order.findByIdAndUpdate(
            { _id: id },
            req.body,
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({
                message: 'Commande non trouvée',
            });
        }
        return res.status(200).json({
            message: 'Commande mise à jour avec succès',
            data: updatedOrder,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            error
        });
    }
}

export const updateStatusById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!Object.values(DeliveryStatus).includes(status)) {
            return res.status(400).json({
                message: 'Statut invalide',
            });
        }

        const updatedOrder: IOrder | null = await Order.findByIdAndUpdate(
            { _id: id },
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                message: 'Commande non trouvée',
            });
        }
        
        // update the status of the delivery object
        await axios.patch(`${config.deliveryServiceUrl}/deliveries/status/${id}`, { status });

        return res.status(200).json({
            message: 'Statut de la commande mis à jour avec succès',
            data: updatedOrder,
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            error
        });
    }
};

export const deleteOrderById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const deletedOrder: IOrder | null = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({
                message: 'Commande non trouvée',
            });
        }
        return res.status(200).json({
            message: 'Commande supprimée avec succès',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erreur serveur',
            error
        });
    }
};

