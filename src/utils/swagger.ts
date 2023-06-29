import swaggerJsDoc from 'swagger-jsdoc'

export default swaggerJsDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Apis Documentation',
      version: '1.0.0',
      description: 'This is the API documentation',
    },
  },
  apis: ['./src/routes/*.ts'],
})
