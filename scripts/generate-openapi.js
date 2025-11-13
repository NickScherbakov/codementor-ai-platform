#!/usr/bin/env node

/**
 * Generate OpenAPI specification from JSDoc comments in backend code
 */

const fs = require('fs');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CodeMentor AI API',
    version: '1.0.0',
    description: 'Intelligent Programming Learning Platform API',
    contact: {
      name: 'CodeMentor AI Team',
      email: 'api-support@codementor-ai.com',
      url: 'https://github.com/codementor-ai/platform'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001/api',
      description: 'Development server'
    },
    {
      url: 'https://api.codementor-ai.com/api',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      BearerAuth: []
    }
  ]
};

// Options for swagger-jsdoc
const options = {
  definition: swaggerDefinition,
  apis: [
    './routes/*.js',
    './models/*.js',
    './controllers/*.js'
  ]
};

// Generate OpenAPI specification
const specs = swaggerJSDoc(options);

// Output the specification as YAML
console.log(JSON.stringify(specs, null, 2));

// Optionally write to file
if (process.argv.includes('--write-file')) {
  const outputPath = path.join(__dirname, '../docs/api/generated-openapi.json');
  fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2));
  console.error(`OpenAPI specification written to ${outputPath}`);
}