const websocket = require('socket.io');

let io;

module.exports = {
  init: (httpServer) => {
    io = websocket(httpServer, {
      cors: {
        origin: '*',
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized');
    }
    return io;
  },
};
