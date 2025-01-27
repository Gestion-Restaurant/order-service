import { Request, Response } from 'express';
import IOrder from "../interfaces/orderInterface";
import Order from "../models/orderSchema";
import {DeliveryStatus} from "../enums/deliveryStatusEnum";

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders: IOrder[] = await Order.find();
        res.status(200).json({
            message: 'Commandes récupérées avec succès',
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur serveur',
            error
        });
    }
}

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const order: IOrder | null = await Order.findById(id);
        if (!order) {
            res.status(404).json({
                message: 'Commande non trouvée',
            });
            return;
        }
        res.status(200).json({
            message: 'Commande récupérée avec succès',
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur serveur',
            error
        });
    }
};

export const getOrdersByClientId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { clientId } = req.params;
        const orders: IOrder[] = await Order.find
            ({ clientId });
        if (!orders) {
            res.status(404).json({
                message: 'Commandes non trouvées',
            });
            return;
        }
        res.status(200).json({
            message: 'Commandes récupérées avec succès',
            data: orders,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur serveur',
            error
        });
    }
}

export const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const order: IOrder = new Order(req.body);
        const newOrder: IOrder = await order.save();
        res.status(201).json({
            message: 'Commande créée avec succès',
            data: newOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur serveur',
            error,
        });
    }
}

export const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updatedOrder: IOrder | null = await Order.findByIdAndUpdate(
            { _id: id },
            req.body,
            { new: true }
        );
        if (!updatedOrder) {
            res.status(404).json({
                message: 'Commande non trouvée',
            });
            return;
        }
        res.status(200).json({
            message: 'Commande mise à jour avec succès',
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur serveur',
            error
        });
    }
}

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder: IOrder | null = await Order.findByIdAndUpdate(
            { _id: id },
            { status },
            { new: true }
        );

        if (!Object.values(DeliveryStatus).includes(status)) {
            res.status(400).json({
                message: `Statut invalide.}`,
            });
            return;
        }

        if (!updatedOrder) {
            res.status(404).json({
                message: 'Commande non trouvée',
            });
            return;
        }
        res.status(200).json({
            message: 'Statut de la commande mis à jour avec succès',
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur serveur',
            error
        });
    }
}

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedOrder: IOrder | null = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
            res.status(404).json({
                message: 'Commande non trouvée',
            });
            return;
        }
        res.status(200).json({
            message: 'Commande supprimée avec succès',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur serveur',
            error
        });
    }
}
