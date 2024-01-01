import { Kafka, Partitioners, Producer } from "kafkajs";
import fs from "fs";

import { MessageT } from "./sockets";
import prisma from "./prisma";

const kafka = new Kafka({
  brokers: [process.env.KAFKA_BROKER_URL || ""],
  ssl: {
    ca: [fs.readFileSync("./ca.pem", "utf-8")],
  },
  sasl: {
    mechanism: "plain",
    username: process.env.KAFKA_USERNAME || "",
    password: process.env.KAFKA_PASSWORD || "",
  },
});

let producer: Producer | null = null;

const createProducer = async () => {
  if (producer) return producer;
  const _producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });
  await _producer.connect();
  producer = _producer;
  return producer;
};

export const produceMessage = async (msg: MessageT) => {
  const _producer = await createProducer();
  await _producer.send({
    topic: "MESSAGES",
    messages: [{ key: `message-${Date.now()}`, value: JSON.stringify(msg) }],
  });
};

export const consumeMessages = async () => {
  const consumer = kafka.consumer({ groupId: "my-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });

  consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return;
      const msg = await JSON.parse(message.value.toString());
      try {
        await prisma.message.create({
          data: {
            userId: msg.id,
            text: msg.message,
          },
        });
      } catch (error) {
        console.error("Something went wrong with Database");
        pause();
        setTimeout(() => {
          consumer.resume([{ topic: "MESSAGES" }]);
        }, 1000 * 60);
      }
    },
  });
};
export default kafka;
