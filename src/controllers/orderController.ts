import { Request, Response } from 'express';

export const createOrder = (req: Request, res: Response) => {
    const newOrder = {
        id: '1',
        item: req.body.item || 'Produit fictif',
        price: req.body.price || 99.99,
        status: req.body.status || 'En cours',
        customerId: req.body.customerId || 'client1',
        restaurantId: req.body.restaurantId || 'restaurant1',
    };

    res.status(201).json({
        message: 'Commande créée avec succès',
        data: newOrder,
    });
};

export const getOrder = (req: Request, res: Response) => {
    const order = {
        id: req.params.id,
        item: 'Produit fictif',
        price: 99.99,
        status: 'En cours',
        customerId: 'client1',
        restaurantId: 'restaurant1',
    };

    res.status(200).json({
        message: 'Commande récupérée avec succès',
        data: order,
    });
};
