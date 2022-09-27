const swaggerJsdoc = require('swagger-jsdoc');

let server = process.env.API_SCHEMES + "://" + process.env.API_HOST + process.env.API_SWAGGER_PATH;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kuky Admin API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        accessToken: {
          type: "apiKey",
          name: "access-token",
          in: "header"
        },
      }
    },
    servers: [{ url: server }],
    security: [
      { accessToken: [] }
    ]
  },
  swaggerInfoRedundant: {
    info: {
      title: 'Kuky Admin API',
      version: '1.0.0',
    },
    host: process.env.SWAGGER_HOST,
    basePath: process.env.API_SWAGGER_PATH,
    securityDefinitions: {
      accessToken: {
        type: "apiKey",
        name: "access-token",
        in: "header"
      },
    },
    security: [
      { accessToken: [] }
    ]
  },
  apis: ['./src/admin/**/*.js'], // files containing annotations as above
};

module.exports.get = async (event, context, callback) => {
  let swaggerData = swaggerJsdoc(options);
  swaggerData.host = process.env.API_HOST;
  swaggerData.schemes = [process.env.API_SCHEMES];
  return { statusCode: 200, body: JSON.stringify(swaggerData) };
};
