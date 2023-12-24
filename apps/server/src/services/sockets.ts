import { pub } from "./redis";

const onConnection = (socket: any) => {
  socket.on("event:message", readMessage);
};

const readMessage = async (msg: string) => {
  await pub.publish("Messages", JSON.stringify(msg));
};

export default onConnection;
