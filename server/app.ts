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
import initAuth from '../packages/auth/server';

const xss = require('xss-clean');

export const app = express();

import '../packages/auth/server/config';

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

connectSession(app);
initAuth(app);

//connect front
app.use(express.static('dist'));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
