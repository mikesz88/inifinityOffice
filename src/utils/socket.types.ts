export interface ServerToClientEvents {
  // noArg: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
  roomCreated: (name: string, description: string, id: string) => void;
  userTypingUpdate: (
    typingUsers: { [T: string]: string },
    roomId?: string
  ) => void;
  messageCreated: (
    messageBody: string,
    userId: string,
    businessId: string,
    id: string,
    timestamp: Date
  ) => void;
}

export interface ClientToServerEvents {
  newRoom: (name: string, description: string, businessId: string) => void;
  newMessage: (
    messageBody: string,
    userId: string,
    roomId: string,
    businessId: string
  ) => void;
  startType: (displayName: string, roomId: string) => void;
  stopType: (displayName: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
