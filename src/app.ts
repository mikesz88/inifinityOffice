import { Business, User } from '@prisma/client';
import express from 'express';
import 'express-async-errors';
import socket from 'socket.io';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './utils/socket.types';
import db from '../prisma/db.setup';
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();
const server = http.createServer(app);
const io = new socket.Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server);

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

// display routes in console
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/auth', auth);
app.use('/api/v1/business', business);

let typingUsers: { [T: string]: string } = {};

// Socket IO
io.on('connection', function (client) {
  console.log('New user connected');
  //Listens for a new chat message
  client.on('newRoom', async (name, description, businessId) => {
    // Create/Save channel in db
    const newRoom = await db.room.create({
      data: {
        name,
        description,
        businessId,
      },
    });
    //Send message to those connected in the room
    io.emit('roomCreated', newRoom.name, newRoom.description, newRoom.id);
  });

  //Listens for user typing.
  client.on('startType', function (displayName, roomId) {
    console.log('User ' + displayName + ' is writing a message...');
    typingUsers[displayName] = roomId;
    io.emit('userTypingUpdate', typingUsers, roomId);
  });

  client.on('stopType', function (userName) {
    console.log('User ' + userName + ' has stopped writing a message...');
    delete typingUsers[userName];
    io.emit('userTypingUpdate', typingUsers);
  });

  //Listens for a new chat message
  client.on('newMessage', async (messageBody, userId, roomId, businessId) => {
    //Create message
    console.log(messageBody);

    // Create/Save message in db
    const newMessage = await db.message.create({
      data: {
        messageBody,
        userId,
        roomId,
        businessId,
      },
    });

    //Send message to those connected in the room
    console.log('new message sent');

    io.emit(
      'messageCreated',
      newMessage.messageBody,
      newMessage.userId,
      newMessage.businessId,
      newMessage.id,
      newMessage.timeStamp
    );
  });
});

// set port, listen for requests
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
