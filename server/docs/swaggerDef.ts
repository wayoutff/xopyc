import pkg from '../../package.json';
import { config } from '../config/config';

export const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Xopyc Boiler',
    version: pkg.version,
    license: {
      name: 'MIT',
      url: 'https://github.com/wayoutff/xopyc/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};
