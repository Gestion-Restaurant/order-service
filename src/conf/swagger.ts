import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentation ORDER API',
            version: '1.0.0',
            description: 'Gestion des orders',
        },
    },
    apis: ['../src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
