const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Cars API',
        description: 'cars',
    },
    host: 'car-shop-xjgj.onrender.com',
    schemes: ['https', 'http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);