import { Business, User } from '@prisma/client';
import express from 'express';
import 'express-async-errors';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import socketApi from './socket/socket';

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();
const server = http.createServer(app);
socketApi.io.attach(server);

dotenv.config();
declare global {
  namespace Express {
    interface Request {
      user?: User;
      business?: Business;
    }
  }
}

// cookieParser
app.use(cookieParser());

app.use(express.json());

// security features
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
});

app.use(limiter);

// ROute files
const auth = require('./routes/auth');
const business = require('./routes/business');
const socket = require('./routes/socket');

// display routes in console
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/business', business);
app.use('/api/v1/socket', socket);

// set port, listen for requests
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
