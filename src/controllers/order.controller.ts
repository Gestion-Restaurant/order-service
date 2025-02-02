import { Request, Response } from 'express';
import IOrder from "../interfaces/IOrder";
import Order from "../models/orderSchema";
import {DeliveryStatus} from "../enums/deliveryStatusEnum";
import {config} from "../conf/config";
import axios from 'axios';

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
}

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
        const orders: IOrder[] = await Order.find({ clientId });
        if (!orders) {
            return res.status(404).json({
                message: 'Commandes non trouvées',
            });
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
        order.status = DeliveryStatus.PENDING;
        const newOrder: IOrder = await order.save();
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

        try {
            switch (status) {
                case DeliveryStatus.IN_KITCHEN:
                    await axios.post(`${config.kitchenServiceUrl}`, {
                        orderId: id,
                        items: updatedOrder.items,
                        restaurantId: updatedOrder.restaurantId,
                        clientId: updatedOrder.clientId
                    });
                    //TODO A FAIRE AXEL
                    break;
                case DeliveryStatus.READY_FOR_DELIVERY:
                    await axios.post(`${config.deliveryServiceUrl}`, {
                        orderId: id,
                        items: updatedOrder.items,
                        restaurantId: updatedOrder.restaurantId,
                        clientId: updatedOrder.clientId
                    });
                    //TODO A FAIRE NOUREDDINE
                    break;
                case DeliveryStatus.IN_TRANSIT:
                case DeliveryStatus.DELIVERED:
                    await axios.post(`${config.customerServiceUrl}`, {
                        orderId: id,
                        items: updatedOrder.items,
                        restaurantId: updatedOrder.restaurantId,
                        clientId: updatedOrder.clientId
                    });
                    break;
            }
        } catch (error) {
            console.error('Erreur lors de la notification:', error);
        }

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
}

