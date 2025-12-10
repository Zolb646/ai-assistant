"use client";

import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { BsChat } from "react-icons/bs";
import { FiX } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ResultRenderer } from "../_components/resultRenderer";

type ChatMessage = {
  role: "user" | "ai";
  content: string;
};

export default function ChatBot() {
  const [clicked, setClicked] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (clicked && messages.length === 0) {
      setMessages([
        { role: "ai", content: "Hello! How can I help you today?" },
      ]);
    }
  }, [clicked]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat: input }),
      });

      const data = await res.json();

      if (data.err) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: `Error: ${data.err}` },
        ]);
      } else if (data.text) {
        setMessages((prev) => [...prev, { role: "ai", content: data.text }]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "ai",
        content: `Error: ${error}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <Popover open={clicked}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className={`${
            clicked ? "invisible" : ""
          } absolute bottom-10 right-15 rounded-full p-5.5 shadow-lg`}
          onClick={() => setClicked(true)}
        >
          <BsChat />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-96 h-120 flex flex-col">
        <div className="flex w-full items-center justify-between px-4 py-2 border-b">
          <p className="text-base font-medium">Chat Assistant</p>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setClicked(false)}
          >
            <FiX className="size-3" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col px-4 py-3 gap-2 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`${
                msg.role === "user"
                  ? "self-end bg-blue-500 text-white"
                  : "self-start bg-gray-300 text-black"
              } px-3 py-2 rounded-lg max-w-[80%]`}
            >
              {msg.role === "ai" ? (
                <ResultRenderer result={msg.content} />
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          ))}

          {loading && (
            <div className="self-start bg-gray-300 text-black px-3 py-2 rounded-lg max-w-[80%] animate-pulse">
              AI is typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="h-14 flex items-center gap-3 px-4 mt-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button
            size="icon"
            className="rounded-full p-4.5"
            onClick={sendMessage}
            disabled={loading}
          >
            <Send />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
