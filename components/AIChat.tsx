
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendMessageToGemini, generateSystemInstruction, sendToolResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { usePortfolio } from '../contexts/PortfolioContext';

const EMAIL_SUBMISSION_TIMEOUT_MS = 15000;

const AIChat: React.FC = () => {
  const { data, rawMarkdown } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hi! I'm Ruiping's AI Assistant. **She** is a System Architect with deep expertise in automotive security and test engineering. Ask me about her side projects or her architectural background!",
      timestamp: new Date()
    }
  ]);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const contextData = rawMarkdown ? { ...data, rawResume: rawMarkdown } : data;
      const systemInstruction = generateSystemInstruction(contextData as any);
      const response = await sendMessageToGemini(userMsg.text, systemInstruction);

      if (response.functionCall && response.functionCall.name === 'delegate_to_owner') {
        const { user_email, user_name, question, conversation_summary } = response.functionCall.args;

        const botMsg: ChatMessage = {
          role: 'model',
          text: response.text || "One moment, I'm forwarding your request to Ruiping...",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);

        // Execute the delegation
        const toolResult = await handleDelegation(user_email, user_name, question, conversation_summary);

        if (!toolResult.success) {
          const finalBotMsg: ChatMessage = {
            role: 'model',
            text: `I couldn't send the email automatically: ${toolResult.error} Please email Ruiping directly at ${data.email}.`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, finalBotMsg]);
          return;
        }

        // Send tool response back to Gemini for the second turn
        const finalResponse = await sendToolResponse(response.functionCall.id, toolResult);

        const finalBotMsg: ChatMessage = {
          role: 'model',
          text: finalResponse.text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, finalBotMsg]);
      } else {
        const botMsg: ChatMessage = {
          role: 'model',
          text: response.text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelegation = async (senderEmail: string | undefined, senderName: string | undefined, content: string, summary: string) => {
    const recipientEmail = data.email.trim();
    const normalizedSenderEmail = senderEmail?.trim() || '';
    const normalizedSenderName = senderName?.trim() || 'a visitor';

    if (!recipientEmail || !normalizedSenderEmail) {
      return { success: false, error: "Missing recipient or sender email address." };
    }

    setIsSubmittingEmail(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), EMAIL_SUBMISSION_TIMEOUT_MS);

    try {
      const response = await fetch('/api/contact', {
        method: "POST",
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          senderName: normalizedSenderName,
          senderEmail: normalizedSenderEmail,
          question: content,
          summary,
        })
      });

      const responseText = await response.text();
      let responseData: any = null;
      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch {
        responseData = null;
      }

      if (response.ok && responseData?.success !== false) {
        return { success: true, details: "The email was successfully sent to Ruiping." };
      }

      const providerMessage = responseData?.message || responseData?.error || responseText || response.statusText;
      console.error("Email API rejected delegation email:", providerMessage);
      return {
        success: false,
        error: `Email API rejected the message: ${providerMessage}`
      };
    } catch (error) {
      console.error("Failed to send delegation email:", error);
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { success: false, error: "Email service timed out." };
      }
      return { success: false, error: "Network error during email delegation." };
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmittingEmail(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-[var(--ink)] border border-[var(--paper)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[var(--paper)] border-b border-[var(--paper)] p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-[0.2em] text-[var(--ink)] text-xs uppercase">Terminal / Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--ink)] opacity-70 hover:opacity-100 transition-opacity"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 text-[14px] leading-relaxed font-mono ${msg.role === 'user'
                    ? 'bg-[var(--paper)] text-[var(--ink)]'
                    : 'bg-transparent text-[var(--paper)] border border-[var(--paper)]'
                    }`}
                >
                  <div className="prose-chat">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 border border-[var(--paper)]">
                  <Loader2 size={16} className="animate-spin text-[var(--paper)]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--paper)] bg-[var(--ink)]">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="PROMPT >"
                className="w-full bg-transparent text-[var(--paper)] placeholder-[var(--paper)]/40 border border-[var(--paper)] py-3 pl-4 pr-12 focus:outline-none focus:ring-0 font-mono text-sm"
              />
              <button
                type="submit"
                disabled={isLoading || isSubmittingEmail || !input.trim()}
                className="absolute right-0 top-0 bottom-0 px-4 bg-[var(--paper)] text-[var(--ink)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-bold uppercase text-xs tracking-wider"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-3 bg-[var(--ink)] text-[var(--paper)] border border-[var(--paper)] hover:bg-[var(--paper)] hover:text-[var(--ink)] py-3 px-6 transition-colors ${isOpen ? 'hidden' : 'block'}`}
      >
        <span className="font-bold tracking-[0.2em] text-xs uppercase">Chat with Career Agent</span>
      </button>
    </div>
  );
};

export default AIChat;
