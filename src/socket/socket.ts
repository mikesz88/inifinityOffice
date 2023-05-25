import { Server } from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from '../utils/socket.types';
import db from '../../prisma/db.setup';

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>({
  cors: {
    origin: '*',
  },
});

const socketApi = {
  io,
};

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
        capacity: 25,
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

export default socketApi;
