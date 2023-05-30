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
  console.log(`User Connected: ${client.id}`);

  // Triggered when a peer hits the join room button.
  client.on('join', (roomName) => {
    const { rooms } = socketApi.io.sockets.adapter;
    const room = rooms.get(roomName);
    console.log({ roomName });

    // room == undefined when no such room exists.
    if (room === undefined) {
      client.join(roomName);
      client.emit('created');
      console.log('created');
    } else if (room.size === 1) {
      // room.size == 1 when one person is inside the room.
      client.join(roomName);
      client.emit('joined');
      console.log('joined');
    } else {
      // when there are already two people inside the room.
      client.emit('full');
    }
    console.log({ rooms });
  });

  // Triggered when the person who joined the room is ready to communicate.
  client.on('ready', (roomName) => {
    console.log({ roomName });
    client.broadcast.to(roomName).emit('ready'); // Informs the other peer in the room.
  });

  // Triggered when server gets an icecandidate from a peer in the room.
  client.on('iceCandidate', (candidate, roomName) => {
    console.log({ candidate });
    client.broadcast.to(roomName).emit('iceCandidate', candidate); // Sends Candidate to the other peer in the room.
  });

  // Triggered when server gets an offer from a peer in the room.
  client.on('offer', (offer, roomName) => {
    console.log({ offer });
    client.broadcast.to(roomName).emit('offer', offer); // Sends Offer to the other peer in the room.
  });

  // Triggered when server gets an answer from a peer in the room
  client.on('answer', (answer, roomName) => {
    console.log({ answer });
    client.broadcast.to(roomName).emit('answer', answer); // Sends Answer to the other peer in the room.
  });

  client.on('leave', (roomName) => {
    client.leave(roomName);
    client.broadcast.to(roomName).emit('leave');
  });

  client.on('chatMessage', async (messageBody, roomId, userId, businessId) => {
    console.log({ messageBody, roomId, userId, businessId });
    const newMessage = await db.message.create({
      data: {
        messageBody,
        roomId,
        userId,
        businessId,
      },
    });
    // const roomName = Array.from(client.rooms);
    console.log({ newMessage });

    io.to(roomId).emit('chatMessage', messageBody, roomId, userId, businessId);
  });
});

export default socketApi;
