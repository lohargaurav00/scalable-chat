"use client";
import React from "react";
import { useSocket } from "../providers/SocketProvider";
import styles from "./page.module.css";

const Page = () => {
  const [message, setMessage] = React.useState("");
  const { sendMessage, messages } = useSocket();

  return (
    <>
      <div>
        <input
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          aria-label="message"
          id="message"
          value={message}
          className={styles.chatInput}
        />
        <button
          onClick={() => {
            sendMessage(message);
            setMessage("");
          }}
          className={styles.chatButton}
        >
          Send
        </button>
      </div>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.length > 0 &&
            messages.map((msg, index) => (
              <li key={index}>
                {msg.id.slice(0, 6)}: {msg.message}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
};

export default Page;
