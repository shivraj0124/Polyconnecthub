import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import axios from "axios";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
 const VITE_CHATBOT_BACKEND = import.meta.env.VITE_CHATBOT_BACKEND;
  const toggleChatbot = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen]);

 const sendMessage = async () => {
  if (input.trim() === "") return;

  const userMessage = { text: input, sender: "user" };
  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);
  setInput("");

  setMessages((prev) => [...prev, { sender: "bot", loading: true }]);

  try {
    const response = await fetch(`${VITE_CHATBOT_BACKEND}/process_data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: input,
        history: messages.map((msg) => msg.text).join("\n"),
      }),
    });

    let botReply = "";

    if (response.ok) {
      try {
        const data = await response.json();
        botReply = data || "I didn't get a proper response, but I'm here!";
      } catch {
        botReply = "Sorry, something went wrong while understanding the response.";
      }
    } else {
      botReply = "Oops! The server is not responding properly. Try again later.";
    }

    setMessages((prev) => {
      const filtered = prev.filter((msg) => !msg.loading);
      return [...filtered, { text: botReply, sender: "bot" }];
    });
  } catch {
    setMessages((prev) => {
      const filtered = prev.filter((msg) => !msg.loading);
      return [
        ...filtered,
        { text: "⚠️ Our server is currently unreachable. Please try again shortly.", sender: "bot" },
      ];
    });
  }
};


  const Loader = () => (
    <div className="inline-block space-x-1">
      <span className="inline-block w-2 h-2 bg-slate-400 dark:bg-slate-300 rounded-full animate-bounce [animation-delay:0.1s]" />
      <span className="inline-block w-2 h-2 bg-slate-400 dark:bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
      <span className="inline-block w-2 h-2 bg-slate-400 dark:bg-slate-300 rounded-full animate-bounce [animation-delay:0.3s]" />
    </div>
  );

  return (
    <div className="fixed bottom-5 right-5 max-md:right-2 max-md:bottom-2 z-50">
      {/* Chat Toggle Button */}
      <div onClick={toggleChatbot}>
        <button className="p-3 bg-green-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 hover:shadow-xl">
          <MessageCircle size={28} />
        </button>
      </div>

      {/* Chatbot Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-16 right-0 w-80 bg-white dark:bg-slate-800 shadow-2xl rounded-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center bg-green-600 text-white p-4">
            <h3 className="text-lg font-semibold">PolyConnectHub</h3>
            <button onClick={toggleChatbot}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 h-64 overflow-y-auto text-sm text-slate-800 dark:text-slate-200">
            {messages.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">Start the conversation...</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block px-3 py-2 rounded-lg max-w-[75%] break-words ${
                      msg.sender === "user"
                        ? "bg-green-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-black dark:text-white"
                    }`}
                  >
                    {msg.loading ? <Loader /> : msg.text}
                  </span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="flex p-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <input
              type="text"
              className="flex-1 p-2 rounded-l-lg bg-white dark:bg-slate-700 dark:text-white focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700"
            >
              Send
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
