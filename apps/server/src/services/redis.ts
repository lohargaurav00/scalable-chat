import { Redis } from "ioredis";
import { io } from "../index";

const { REDIS_CONNECTION_URL } = process.env;

export const pub = new Redis(REDIS_CONNECTION_URL || "");
const sub = new Redis(REDIS_CONNECTION_URL || "");

sub.subscribe("Messages", (err: any, count: any) => {
  if (err) {
    throw new Error(err.message);
  }
  console.log(`Subscribed to ${count} channel(s)`);
});

sub.on("message", (channel: string, message: string) => {
  if (channel === "Messages") {
    io.emit("messages", JSON.parse(message));
  }
});

