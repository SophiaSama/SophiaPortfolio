
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
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="text-white" size={18} />
              <h3 className="font-semibold text-white">AI Career Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
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
                <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700">
                  <Loader2 size={16} className="animate-spin text-indigo-400" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 bg-slate-900 border-t border-slate-800">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Ruiping's projects..."
                className="w-full bg-slate-800 text-white placeholder-slate-500 border border-slate-700 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || showEmailPrompt}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        className={`group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-full shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:scale-105 ${isOpen ? 'scale-0 opacity-0 hidden' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={20} />
        <span className="font-medium">Ask AI about Ruiping</span>
      </button>
    </div>
  );
};

export default AIChat;
