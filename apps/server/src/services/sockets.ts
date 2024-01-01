import { Socket } from "socket.io";
import { pub } from "./redis";
import { produceMessage } from "./kafka";

export type MessageT = {
  id: Socket["id"];
  message: string;
};

const onConnection = (socket: any) => {
  socket.on("event:message", readMessage);
};

const readMessage = async (msg: MessageT) => {
  await pub.publish("Messages", JSON.stringify(msg));
  await produceMessage(msg);
};

export default onConnection;
