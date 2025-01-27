import express from 'express';
import {
    createOrder,
    deleteOrderById,
    getAllOrders,
    getOrderById,
    getOrdersByClientId,
    updateOrderById,
    updateStatusById
} from '../controllers/orderController';

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Récupère toutes les commandes
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Liste des commandes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Erreur serveur
 */
router.get('/Orders', getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Récupère une commande par ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/Orders/ById/:id', getOrderById);

/**
 * @swagger
 * /api/orders/client/{clientId}:
 *   get:
 *     summary: Récupère les commandes d'un client
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du client
 *     responses:
 *       200:
 *         description: Liste des commandes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commandes non trouvées
 *       500:
 *         description: Erreur serveur
 */
router.get('/Orders/ByIdClient/:clientId', getOrdersByClientId);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crée une nouvelle commande
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Erreur serveur
 */
router.post('/Orders', createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Met à jour une commande
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Commande mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.put('/Orders/ById/:id', updateOrderById);

/**
 * @swagger
 * /api/orders/{id}:
 *   patch:
 *     summary: Met à jour le statut d'une commande
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, assigned, in-transit, delivered]
 *                 description: Nouveau statut de la commande
 *     responses:
 *       200:
 *         description: Statut de la commande mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Statut invalide
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.patch('/Orders/ById/:id', updateStatusById);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Supprime une commande
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande supprimée avec succès
 *       404:
 *         description: Commande non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/Orders/ById/:id', deleteOrderById);

export default router;
