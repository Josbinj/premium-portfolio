"use client";

import { useState, useEffect } from "react";
import { fetchContactMessages } from "@/lib/api";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchContactMessages();
        setMessages(res || []);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif tracking-tight text-text">Contact Messages</h1>
        <p className="text-text-muted mt-2">View messages sent through your portfolio contact form.</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-text-muted">No messages found.</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="glass border border-border/50 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-border/50 pb-4">
                <div>
                  <h3 className="text-lg font-medium text-text">{msg.subject}</h3>
                  <p className="text-sm text-text-muted">From: {msg.name} ({msg.email})</p>
                </div>
                <span className="text-xs text-text-muted">{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-text whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
