import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";

import onConnection from "./services/sockets";

const httpServer = createServer();
const PORT = process.env.PORT || 8000;

export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    allowedHeaders: ["*"],
  },
});

io.on("connection", onConnection);

httpServer.listen(PORT, () => {
  console.log(`listening on port:${PORT}`);
});
