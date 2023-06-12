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
  client.on('join', async (roomId) => {
    const { rooms } = socketApi.io.sockets.adapter;
    const room = rooms.get(roomId);
    console.log({ roomId });

    const roomSize = await db.room.findUnique({
      where: { id: roomId },
      select: { capacity: true },
    });

    // room == undefined when no such room exists.
    if (room === undefined) {
      client.join(roomId);
      client.emit('created');
      console.log('created');
    } else if (room.size < roomSize!.capacity) {
      // room.size == 1 when one person is inside the room.
      client.join(roomId);
      client.emit('joined');
      console.log('joined');
    } else {
      // when there are already two people inside the room.
      client.emit('full');
    }
    console.log({ rooms });
  });

  // Triggered when the person who joined the room is ready to communicate.
  client.on('ready', (roomId) => {
    console.log({ roomId });
    client.broadcast.to(roomId).emit('ready'); // Informs the other peer in the room.
  });

  // Triggered when server gets an icecandidate from a peer in the room.
  client.on('iceCandidate', (candidate, roomId) => {
    console.log({ candidate });
    client.broadcast.to(roomId).emit('iceCandidate', candidate); // Sends Candidate to the other peer in the room.
  });

  // Triggered when server gets an offer from a peer in the room.
  client.on('offer', (offer, roomId) => {
    console.log({ offer });
    client.broadcast.to(roomId).emit('offer', offer); // Sends Offer to the other peer in the room.
  });

  // Triggered when server gets an answer from a peer in the room
  client.on('answer', (answer, roomId) => {
    console.log({ answer });
    client.broadcast.to(roomId).emit('answer', answer); // Sends Answer to the other peer in the room.
  });

  client.on('leave', (roomId) => {
    client.leave(roomId);
    client.broadcast.to(roomId).emit('leave');
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
    // const roomId = Array.from(client.rooms);
    console.log({ newMessage });

    io.to(roomId).emit('chatMessage', messageBody, roomId, userId, businessId);
  });
});

export default socketApi;
