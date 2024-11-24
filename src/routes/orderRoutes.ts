import express from 'express';
import { createOrder, getOrder } from '../controllers/orderController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - orderDate
 *         - total
 *         - status
 *         - customerId
 *         - kitchenId
 *         - deliverId
 */

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
 *         description: La commande a été créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post('/orders', createOrder);

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
 */
router.get('/orders/:id', getOrder);

export default router;
