
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, RotateCcw, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendMessageToGemini, generateSystemInstruction, sendToolResponse, resetChatSession } from '../services/geminiService';
import { ChatMessage } from '../types';
import { usePortfolio } from '../contexts/PortfolioContext';

const CONTACT_NOTIFICATION_TIMEOUT_MS = 15000;
const INITIAL_ASSISTANT_MESSAGE = "Hi! I'm Ruiping's AI Assistant. **She** is a System Architect with deep expertise in automotive security and test engineering. Ask me about her side projects or her architectural background!";

const createMessageId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const createChatMessage = (role: ChatMessage['role'], text: string): ChatMessage => ({
  id: createMessageId(),
  role,
  text,
  timestamp: new Date()
});

const createInitialMessages = (): ChatMessage[] => [
  createChatMessage('model', INITIAL_ASSISTANT_MESSAGE)
];

const AIChat: React.FC = () => {
  const { data, rawMarkdown } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => createInitialMessages());
  const [isSubmittingContactNotification, setIsSubmittingContactNotification] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isBusy = isLoading || isSubmittingContactNotification;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleResetConversation = () => {
    resetChatSession();
    setInput('');
    setIsLoading(false);
    setIsSubmittingContactNotification(false);
    setMessages(createInitialMessages());
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isBusy) return;

    const userMsg = createChatMessage('user', input.trim());

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const contextData = rawMarkdown ? { ...data, rawResume: rawMarkdown } : data;
      const systemInstruction = generateSystemInstruction(contextData as any);
      const response = await sendMessageToGemini(userMsg.text, systemInstruction);

      if (response.functionCall && response.functionCall.name === 'delegate_to_owner') {
        const { user_email, user_name, question, conversation_summary } = response.functionCall.args;

        const botMsg = createChatMessage('model', response.text || "One moment, I'm preparing your message for Ruiping...");
        setMessages(prev => [...prev, botMsg]);

        // Execute the delegation
        const toolResult = await handleDelegation(user_email, user_name, question, conversation_summary);

        if (!toolResult.success) {
          const finalBotMsg = createChatMessage('model', `I couldn't notify Ruiping automatically: ${toolResult.error} Please email Ruiping directly at ${data.email}.`);
          setMessages(prev => [...prev, finalBotMsg]);
          return;
        }

        // Send tool response back to Gemini for the second turn
        const finalResponse = await sendToolResponse(response.functionCall.id, toolResult);

        const finalBotMsg = createChatMessage('model', finalResponse.text || "Ruiping has been notified and can reply by email.");
        setMessages(prev => [...prev, finalBotMsg]);
      } else {
        const botMsg = createChatMessage('model', response.text || "I couldn't generate a response just now. Please try again in a moment.");
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (error) {
      console.error("Unexpected chat error:", error);
      setMessages(prev => [
        ...prev,
        createChatMessage('model', "I hit a technical snag while answering. Please try again, or email Ruiping directly if the issue continues.")
      ]);
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

    setIsSubmittingContactNotification(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), CONTACT_NOTIFICATION_TIMEOUT_MS);

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
        return { success: true, details: "Ruiping was notified and can reply by email." };
      }

      const providerMessage = responseData?.message || responseData?.error || responseText || response.statusText;
      console.error("Contact notification API rejected the message:", providerMessage);
      return {
        success: false,
        error: `Notification API rejected the message: ${providerMessage}`
      };
    } catch (error) {
      console.error("Failed to send contact notification:", error);
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { success: false, error: "Notification service timed out." };
      }
      return { success: false, error: "Network error during contact notification." };
    } finally {
      window.clearTimeout(timeoutId);
      setIsSubmittingContactNotification(false);
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
              <MessageSquare size={16} className="text-[var(--ink)]" />
              <span className="font-bold tracking-[0.2em] text-[var(--ink)] text-xs uppercase">Terminal / Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetConversation}
                className="text-[var(--ink)] opacity-70 hover:opacity-100 transition-opacity disabled:opacity-40"
                aria-label="Reset assistant conversation"
                title="Reset conversation"
                disabled={isBusy}
              >
                <RotateCcw size={18} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[var(--ink)] opacity-70 hover:opacity-100 transition-opacity"
                aria-label="Close assistant chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
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
                <div className="max-w-[85%] p-3 border border-[var(--paper)] text-[var(--paper)] font-mono text-[13px] leading-relaxed" aria-live="polite">
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-[var(--paper)] shrink-0" />
                    <span>{isSubmittingContactNotification ? 'Securely notifying Ruiping...' : 'Reviewing Ruiping\'s portfolio context...'}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--paper)] bg-[var(--ink)]">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="PROMPT > Ask about Ruiping's projects, architecture work, or availability"
                rows={2}
                disabled={isBusy}
                aria-label="Message Ruiping's career assistant"
                className="min-h-[52px] max-h-32 flex-1 resize-none bg-transparent text-[var(--paper)] placeholder-[var(--paper)]/40 border border-[var(--paper)] py-3 px-4 focus:outline-none focus:ring-0 font-mono text-sm disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={isBusy || !input.trim()}
                className="h-[52px] w-[52px] inline-flex items-center justify-center bg-[var(--paper)] text-[var(--ink)] hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                aria-label="Send message to assistant"
                title="Send message"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[var(--subtle)] font-mono">Enter sends / Shift+Enter adds a line</p>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open assistant chat"
        className={`group flex items-center gap-3 bg-[var(--ink)] text-[var(--paper)] border border-[var(--paper)] hover:bg-[var(--paper)] hover:text-[var(--ink)] py-3 px-6 transition-colors ${isOpen ? 'hidden' : 'block'}`}
      >
        <MessageSquare size={18} />
        <span className="font-bold tracking-[0.2em] text-xs uppercase">Chat with Career Agent</span>
      </button>
    </div>
  );
};

export default AIChat;
