import express from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import { config } from './config/config';
import * as morgan from './config/morgan';
import { errorConverter, errorHandler } from './middlewares/error';
import { ApiError } from './utils/ApiError';
import connectSession from './middlewares/session.connect';
import authPkg from '../packages/auth/server';

const xss = require('xss-clean');

export const app = express();

import '../packages/auth/server/config';

import { pkgConnector } from '../packages/connector'

let productionMiddlewares = []

if (config.env !== 'test') {
  //@ts-ignore
  productionMiddlewares.push(morgan.successHandler);
  //@ts-ignore
  productionMiddlewares.push(morgan.errorHandler);
}

/**
 * Array of sanitize middlewares
 */
const sanitizeMiddleware = [
  xss(),
  mongoSanitize()
]

/**
 * Array of GZIP middleware
 */
const compressionMiddleware = [compression()]

// enable cors
app.use(cors());
app.options('*', cors());


/**
 * Error middlewares handling
 */
const errorHandlerMiddlewares = [
  errorConverter,
  errorHandler
]

pkgConnector(app, {
  packages: {
    connectSession,
    authPkg: authPkg({ test: true })
  },
  middlewares: [
    /**
     * Set security HTTP headers
     */
    helmet(),

    /**
     * Connect a Production middlewares
     */
    ...productionMiddlewares,

    /**
     * Parse json request body
     */
    express.json(),

    /**
     * Parse urlencoded request body
     */
    express.urlencoded({ extended: true }),

    /**
     * Sanitize request data
     */
    ...sanitizeMiddleware,

    /**
     * Gzip compression
     */
    ...compressionMiddleware,

    /**
     * Connect frontend bundle
     */
    express.static('dist'),

    /**
     * Test middleware for check current state of server
     */
    (req, res, next) => console.log('1',req, res, next),

    /**
     * Send back a 404 error for any unknown api request
     */
    (req, res, next) => next(new ApiError(httpStatus.NOT_FOUND, 'Not found')),

    /**
     * Handling Errors Middlewares
     */
    ...errorHandlerMiddlewares
  ]
})
