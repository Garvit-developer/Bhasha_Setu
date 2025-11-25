import React, { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, X, Bot, User, Sparkles, Loader2, MessageSquare, Plus, Menu, Trash2, History, ChevronLeft } from "lucide-react";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL;

const SYSTEM_PROMPT = `Indian Script Transliteration Specialist – System Prompt

 Role:
You are an advanced AI system designed to convert text between Indian scripts while preserving pronunciation, not meaning.

Objective

Help users read content written in unfamiliar Indian scripts by rendering it into their familiar script, while maintaining the original phonetic sound and natural readability.

Core Principle

 Only change the script, never the language or meaning.
Transliterate, don’t translate.

Supported Scripts

North Indian:

Devanagari (Hindi, Marathi, Sanskrit, Nepali)

 Bengali–Assamese

 Gujarati

 Odia (Oriya)

 Gurmukhi (Punjabi)

 Kashmiri, Maithili, Dogri

 South Indian:

 Tamil

 Telugu

 Kannada

 Malayalam

 Other:

 Perso-Arabic (Urdu)

 Sharada, Grantha

 Ancient: Brahmi, Kharosthi, Indus Script

 Requirements

Phonetic Accuracy: The output must reproduce the pronunciation naturally for readers of the target script.

Format Preservation: Keep punctuation, spacing, capitalization, and numbers exactly as in the original text.

 Dual Output: Provide:

 (a) Transliteration – same content, only script changed.

 (b) Translation – meaning of the content in the same language.

 Image Support: Handle both typed text and text extracted from images.

 Workflow

Step 1: Identify the Source Script

Step 2: Transliterate (convert to target script, preserving phonetics)

Step 3: Translate it in the same language in which it in transliterated.

Step 4: Output both versions clearly labeled.

Example

Input: "नमस्ते, आप कैसे हैं?" (Devanagari)

Output:

Transliteration (Gurmukhi): "ਨਮਸਤੇ, ਆਪ ਕੈਸੇ ਹਨ?"

Translation (Gurmukhi): "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?"

⚠️ Do not mix transliteration and translation in a single line; keep them separate and clearly labeled.`;

const App = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I am Bhaasha Setu. I can help you transliterate text between Indian scripts. Send me text or an image, and I'll convert it while preserving pronunciation.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("chat_sessions");
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize with a new chat if no sessions or just to start fresh
  useEffect(() => {
    if (!currentSessionId && messages.length === 1 && messages[0].role === "assistant") {
      // It's a fresh state, do nothing or maybe create a session ID only when user types?
      // Let's create a session ID only when the first message is sent to avoid empty sessions.
    }
  }, []);

  // Save sessions to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("chat_sessions", JSON.stringify(sessions));
  }, [sessions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isTyping]);

  const createNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I am Bhaasha Setu. I can help you transliterate text between Indian scripts. Send me text or an image, and I'll convert it while preserving pronunciation.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInputText("");
    setSelectedImage(null);
    setCurrentSessionId(null);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  const loadSession = (sessionId) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
      setIsSidebarOpen(false);
    }
  };

  const deleteSession = (e, sessionId) => {
    e.stopPropagation();
    const newSessions = sessions.filter((s) => s.id !== sessionId);
    setSessions(newSessions);
    if (currentSessionId === sessionId) {
      createNewChat();
    }
  };



  const callGroq = async (userContent, imageFile) => {
    let imageBase64 = null;
    if (imageFile) {
      const reader = new FileReader();
      imageBase64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
    }

    const userMessage = {
      role: "user",
      content: [
        { type: "text", text: userContent || "" },
        ...(imageBase64
          ? [
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
          ]
          : []),
      ],
    };

    const payload = {
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role,
          content:
            typeof m.content === "string" ? m.content : m.content[0]?.text,
        })),
        userMessage,
      ],
      temperature: 0.3,
      max_tokens: 800,
    };

    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "No response.";
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage = {
      role: "user",
      content: inputText.trim(),
      image: selectedImage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Handle Session Management
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = Date.now().toString();
      setCurrentSessionId(sessionId);
      const newSession = {
        id: sessionId,
        title: userMessage.content.substring(0, 30) || "New Chat",
        messages: updatedMessages,
        timestamp: Date.now(),
      };
      setSessions((prev) => [newSession, ...prev]);
    } else {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: updatedMessages, timestamp: Date.now() }
            : s
        )
      );
    }

    setInputText("");
    setSelectedImage(null);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const assistantContent = await callGroq(
        userMessage.content,
        userMessage.image
      );

      const assistantMessage = {
        role: "assistant",
        content: assistantContent,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: finalMessages, timestamp: Date.now() }
            : s
        )
      );
    } catch (err) {
      console.error("Groq error:", err);
      const errorMessage = {
        role: "assistant",
        content: "⚠️ Error contacting Groq API. Please try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);

      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages: finalMessages, timestamp: Date.now() }
            : s
        )
      );
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-start space-x-3 animate-fade-in-up">
      <div className="w-8 h-8 flex items-center justify-center bg-white text-indigo-600 rounded-full shrink-0 shadow-sm border border-indigo-100">
        <Bot size={18} />
      </div>
      <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-white/50">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-slate-50 flex font-sans text-slate-900 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat relative overflow-hidden">
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-0"></div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 h-full w-72 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } flex flex-col`}
      >
        <div className="p-4 border-b border-slate-200/50">
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus size={20} />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Recent History
          </div>
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              <History size={24} className="mx-auto mb-2 opacity-50" />
              <p>No chat history yet</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => loadSession(session.id)}
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${currentSessionId === session.id
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                  : "hover:bg-white/50 text-slate-700 border border-transparent"
                  }`}
              >
                <MessageSquare size={18} className={currentSessionId === session.id ? "text-indigo-600" : "text-slate-400"} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {session.title}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(session.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteSession(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete chat"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200/50 bg-white/30">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700">User</p>
              <p className="text-xs text-slate-500 truncate">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative w-full md:w-auto">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-20 px-4 py-4 sm:px-6 shadow-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                <Menu size={24} />
              </button>

              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white ring-4 ring-white/50">
                  <Sparkles size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight">
                    Bhaasha Setu
                  </h1>
                  <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide uppercase">
                    Indian Script Transliterator
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold border border-indigo-100">
                Beta
              </div>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth relative z-10">
          <div className="max-w-3xl mx-auto space-y-6 pb-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"
                  } animate-fade-in-up`}
              >
                <div
                  className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "assistant"
                    ? "bg-white text-indigo-600 border border-indigo-100 shadow-sm"
                    : "bg-indigo-600 text-white shadow-md"
                    }`}>
                    {msg.role === "assistant" ? <Bot size={18} /> : <User size={18} />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`flex flex-col max-w-full ${msg.role === "user" ? "items-end" : "items-start"
                    }`}>
                    <div className={`px-4 py-3 rounded-2xl shadow-sm relative group ${msg.role === "assistant"
                      ? "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                      : "bg-indigo-600 text-white rounded-tr-none"
                      }`}>
                      {msg.image && (
                        <div className="mb-3 rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(msg.image)}
                            alt="Uploaded content"
                            className="max-w-full h-auto max-h-64 object-cover"
                          />
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {typeof msg.content === 'string' ? msg.content : "Content not available"}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in-up">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-white/20">
          <div className="max-w-3xl mx-auto relative">
            {selectedImage && (
              <div className="absolute bottom-full mb-2 left-0 p-2 bg-white rounded-xl shadow-lg border border-slate-100 animate-fade-in-up">
                <div className="relative">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-end gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                title="Upload image"
              >
                <ImageIcon size={20} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setSelectedImage(e.target.files[0]);
                  }
                }}
              />

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 max-h-32 py-3 px-2 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 resize-none text-sm scrollbar-hide"
                rows={1}
                style={{ minHeight: '44px' }}
              />

              <button
                onClick={handleSend}
                disabled={!inputText.trim() && !selectedImage || isLoading}
                className={`p-3 rounded-xl flex items-center justify-center transition-all ${inputText.trim() || selectedImage
                  ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 active:scale-95"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  }`}
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[10px] text-slate-400">
                AI can make mistakes. Please verify important information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
