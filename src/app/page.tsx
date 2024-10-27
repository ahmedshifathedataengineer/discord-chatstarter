"use client";

import { useState } from 'react';
import { api } from "../../convex/_generated/api";
import { useQuery, useMutation } from 'convex/react';

// Main functional component
export default function Home() {
  // Use queries and mutations from the Convex API
  const messages = useQuery(api.functions.message.list); // Updated access path
  const createMessage = useMutation(api.functions.message.create); // Updated access path
  const [input, setInput] = useState("");

  // Function to handle form submission and add a new message
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload on form submission

    // Call the createMessage mutation
    createMessage({ sender: "Alice", content: input }).catch((error) =>
      console.error("Error creating message:", error)
    );

    setInput(""); // Clear the input field
  };

  return (
    <div>
      {/* Map over messages to render them */}
      {messages?.map((message, index) => (
        <div key={index} style={{ marginBottom: "8px" }}>
          <strong>{message.sender}</strong>: {message.content}
        </div>
      ))}

      {/* Form to add new messages */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="message"
          id="message"
          value={input}
          onChange={(e) => setInput(e.target.value)} // Update input state
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
