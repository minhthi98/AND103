const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Dự án quản lý nhân viên',
            version: '1.0.0',
            description: 'Dự án Api app quản lý nhân viên',
           
        },
    },
    apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;