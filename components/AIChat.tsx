
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Mail, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { sendMessageToGemini, generateSystemInstruction, sendToolResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { usePortfolio } from '../contexts/PortfolioContext';

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
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
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

  const handleDelegation = async (senderEmail: string, senderName: string, content: string, summary: string) => {
    setIsSubmittingEmail(true);
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${data.email}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: "Career AI Assistant",
          _subject: `New Career Inquiry from ${senderName} (${senderEmail})`,
          message: `NEW INQUIRY\n\nNAME: ${senderName}\nEMAIL: ${senderEmail}\n\nQUESTION:\n${content}\n\nCONVERSATION SUMMARY:\n${summary}`,
          reply_to: senderEmail,
        })
      });

      if (response.ok) {
        setIsEmailSent(true);
        setTimeout(() => setIsEmailSent(false), 5000);
        return { success: true, details: "The email was successfully sent to Ruiping." };
      }
      return { success: false, error: "Failed to send email via FormSubmit." };
    } catch (error) {
      console.error("Failed to send delegation email:", error);
      return { success: false, error: "Network error during email delegation." };
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-[var(--panel)]/96 backdrop-blur-2xl border border-[var(--line)] rounded-lg shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500 ease-out">
          {/* Header */}
          <div className="bg-[var(--panel-soft)] border-b border-[var(--line)] p-4 flex justify-between items-center relative overflow-hidden">
            <div className="flex items-center gap-2 relative z-10">
              <Sparkles className="text-[var(--copper)]" size={18} />
              <h3 className="font-semibold text-[var(--paper)] tracking-wide text-sm uppercase">Portfolio Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--body-muted)] hover:text-[var(--paper)] transition-colors"
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
                  className={`max-w-[85%] p-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${msg.role === 'user'
                    ? 'bg-[var(--panel-hover)] text-[var(--paper)] border border-[var(--copper)]/25 rounded-tr-sm'
                    : 'bg-[var(--panel-soft)] text-[var(--body)] border border-[var(--line)] rounded-tl-sm'
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
                <div className="bg-[var(--panel-soft)] p-3 rounded-2xl rounded-tl-sm border border-[var(--line)]">
                  <Loader2 size={16} className="animate-spin text-[var(--copper)]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-[var(--panel-soft)] border-t border-[var(--line)]">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Ruiping's projects..."
                className="w-full bg-[var(--ink)] text-[var(--paper)] placeholder-[var(--faint)] border border-[var(--line)] rounded-md py-3.5 pl-4 pr-12 focus:outline-none focus:ring-1 focus:ring-[var(--copper)]/50 focus:border-[var(--copper)]/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || showEmailPrompt}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--panel-soft)] text-[var(--copper)] rounded-md hover:bg-[var(--panel-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2.5 bg-[var(--paper)] text-[var(--ink)] hover:opacity-90 py-3.5 px-6 rounded-md shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1 ${isOpen ? 'scale-0 opacity-0 hidden' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={18} />
        <span className="font-semibold tracking-wide text-sm">Ask About Ruiping</span>
      </button>
    </div>
  );
};

export default AIChat;
