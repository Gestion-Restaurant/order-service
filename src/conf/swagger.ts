import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Order API',
            version: '1.0.0',
            description: 'API pour la gestion des commandes',
        },
        components: {
            schemas: {
                Order: {
                    type: 'object',
                    required: ['clientId', 'items', 'totalAmount', 'status'],
                    properties: {
                        clientId: {
                            type: 'string',
                            description: 'ID du client ayant passé la commande',
                        },
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    dishId: {
                                        type: 'string',
                                        description: 'ID du plat commandé',
                                    },
                                    quantity: {
                                        type: 'integer',
                                        description: 'Quantité commandée',
                                    },
                                },
                            },
                        },
                        totalAmount: {
                            type: 'number',
                            description: 'Montant total de la commande',
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'assigned', 'in-transit', 'delivered'],
                            description: 'Statut de la commande',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date de création de la commande',
                        },
                    },
                    example: {
                        clientId: '6489a0f9a98b2f7e8f1e1234',
                        items: [
                            {
                                dishId: '6489a1c4b2d4f3e9a1c56789',
                                quantity: 2,
                            },
                        ],
                        totalAmount: 45.99,
                        status: 'pending',
                        createdAt: '2024-11-25T12:00:00.000Z',
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
