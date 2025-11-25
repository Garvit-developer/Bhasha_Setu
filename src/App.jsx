import React, { useState, useRef, useEffect } from "react";
import { Send, Image as ImageIcon, X, Bot, User, Sparkles, Loader2 } from "lucide-react";

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isTyping]);

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

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setSelectedImage(null);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const assistantContent = await callGroq(
        userMessage.content,
        userMessage.image
      );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantContent,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (err) {
      console.error("Groq error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Error contacting Groq API. Please try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
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
    <div className="h-screen w-full bg-slate-50 flex flex-col font-sans text-slate-900 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-0"></div>

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-20 px-4 py-4 sm:px-6 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white ring-4 ring-white/50">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Bhaasha Setu
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                Indian Script Transliterator
              </p>
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
        <div className="max-w-4xl mx-auto space-y-6 pb-4">
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
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-full shrink-0 shadow-sm border ${msg.role === "user"
                      ? "bg-indigo-600 text-white border-indigo-500"
                      : "bg-white text-indigo-600 border-indigo-100"
                    }`}
                >
                  {msg.role === "user" ? <User size={18} /> : <Bot size={20} />}
                </div>

                {/* Bubble */}
                <div className="flex flex-col space-y-1">
                  <div
                    className={`px-6 py-4 shadow-md text-sm sm:text-base leading-relaxed backdrop-blur-sm ${msg.role === "user"
                        ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl rounded-tr-none border border-indigo-500/20"
                        : "bg-white/80 border border-white/50 text-slate-800 rounded-2xl rounded-tl-none"
                      }`}
                  >
                    {msg.image && (
                      <div className="mb-3 rounded-lg overflow-hidden bg-black/5 border border-black/5">
                        <img
                          src={URL.createObjectURL(msg.image)}
                          alt="uploaded"
                          className="max-h-60 w-full object-contain"
                        />
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-medium ${msg.role === "user" ? "text-right text-indigo-900/40" : "text-left text-slate-500"
                      }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 sticky bottom-0 z-20 relative z-20">
        <div className="max-w-5xl mx-auto w-full">
          {selectedImage && (
            <div className="mb-4 flex items-center gap-3 bg-white/80 backdrop-blur-md p-2.5 rounded-xl border border-white/50 w-fit animate-fade-in-up shadow-lg shadow-black/5">
              <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-700">
                  Image attached
                </span>
                <span className="text-[10px] text-slate-500 max-w-[150px] truncate">
                  {selectedImage.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="ml-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="relative flex items-end gap-3 bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-2 shadow-xl shadow-indigo-500/10 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all">
            <button
              onClick={() => fileInputRef.current.click()}
              className="p-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-colors"
              title="Upload image"
            >
              <ImageIcon size={22} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message in any Indian script..."
              className="flex-1 bg-transparent border-none focus:ring-0 p-3 text-slate-800 placeholder-slate-500 resize-none max-h-32 min-h-[48px] text-sm sm:text-base font-medium"
              rows="1"
              style={{ height: "auto" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />

            <button
              onClick={handleSend}
              disabled={isLoading || (!inputText.trim() && !selectedImage)}
              className="p-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-300 text-white rounded-2xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 disabled:shadow-none transition-all transform active:scale-95"
              title="Send message"
            >
              {isLoading ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <Send size={22} />
              )}
            </button>
          </div>
          <div className="mt-3 text-center">
            <p className="text-[10px] text-slate-500 font-medium tracking-wide opacity-60">
              AI can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
