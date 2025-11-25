import React, { useState, useRef, useEffect } from "react";
import { Send, Image, X, Bot, User, Sparkles } from "lucide-react";

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
        "Hello! My self Bhaasha Setu. I can help you transliterate text between Indian scripts. Send me text or an image with Indian script text, and I'll convert it while preserving pronunciation.",
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
  }, [messages, isLoading]);

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
          content: "⚠️ Error contacting Groq API.",
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
    <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 p-2 sm:p-3 md:p-4">
      {/* Bot Icon */}
      <div className="w-7 h-7 sm:w-15 sm:h-8 md:w-9 md:h-9 flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full px-2">
        <Bot size={16} />
      </div>

      {/* Typing Dots */}
      <div className="bg-white p-2 sm:p-3 md:p-4 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="fixed inset-0 min-h-full border-box w-full bg-gradient-to-br from-orange-500 via-[#ffffff] to-green-600 flex flex-col">
      <div
        className="flex-1 flex flex-col h-full w-full 
    bg-white/80 backdrop-blur-xl 
    rounded-none sm:rounded-3xl 
    shadow-2xl 
    overflow-hidden max-w-screen-lg mx-auto border-2 border-[#dadada]"
      >
        {/* Header */}
        <div
          className="bg-gradient-to-r from-pink-500 via-[#ffffff] to-blue-600
      p-3 sm:p-4 md:p-6 text-white w-full"
        >
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles size={20} className="text-blue-900" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl text-blue-900 font-bold tracking-wide">
                bhaasha Setu
              </h1>
              <p className=" text-[10px] text-blue-900 sm:text-xs md:text-sm">
                Indian Script Transliterator
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <img className="absolute top-[25%] right-[35%] " src="chakra.png" alt="" />
        <div
          className="flex-1 overflow-y-auto 
      p-2 sm:p-4 md:p-6 
      space-y-3 sm:space-y-4 md:space-y-6 
      bg-gradient-to-b from-gray-50/80 to-white/50 w-full relative "
        >
          
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}
            >
              <div className="flex items-end space-x-2 sm:space-x-3 max-w-[90%] sm:max-w-[85%]">
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full mb-1 px-2">
                    <Bot size={16} className="" />
                  </div>
                )}
                <div className="flex flex-col">
                  <div
                    className={`p-2 sm:p-3 md:p-4 rounded-2xl shadow-lg border text-sm sm:text-base leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-200 text-black rounded-br-md border-blue-200  z-50"
                        : "bg-white text-gray-800 rounded-bl-md border-gray-100  z-50"
                    }`}
                  >
                    {msg.image && (
                      <div className="mb-3 rounded-xl overflow-hidden">
                        <img
                          src={URL.createObjectURL(msg.image)}
                          alt="uploaded"
                          className="max-h-36 sm:max-h-40 md:max-h-48 w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  <div
                    className={`text-[9px] sm:text-[10px] md:text-xs text-gray-400 mt-1 ${
                      msg.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full mb-1">
                    <User size={16} />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200/50 bg-white/80 p-2 sm:p-3 md:p-4 w-full">
          {selectedImage && (
            <div className="mb-3 flex items-center space-x-3 bg-blue-50 p-2 sm:p-3 rounded-xl border border-blue-200">
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="preview"
                className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-cover rounded-lg shadow-sm"
              />
              <div className="flex-1 text-xs sm:text-sm text-gray-600 truncate">
                <p className="font-medium">Image selected</p>
                <p className="text-[10px] sm:text-xs truncate">
                  {selectedImage.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded-full"
              >
                <X size={18} />
              </button>
            </div>
          )}
          <div className="flex flex-wrap items-end gap-2 sm:gap-3">
            {/* Textarea */}
            <div className="flex-1 relative min-w-[200px]">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full border border-gray-300 rounded-xl 
              p-2 sm:p-3 pr-10 
              focus:ring-2 focus:ring-purple-400 focus:border-transparent 
              outline-none resize-none bg-white/90 text-gray-800 
              placeholder-gray-400 shadow-sm 
              text-sm sm:text-base"
                rows="1"
                style={{ minHeight: "44px", maxHeight: "120px" }}
                onInput={(e) => {
                  e.target.style.height = "44px";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 120) + "px";
                }}
              />
            </div>

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current.click()}
              className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-xl shadow-sm hover:shadow-md border border-gray-200"
              title="Upload image"
            >
              <Image size={18} className="text-gray-600" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={isLoading || (!inputText.trim() && !selectedImage)}
              className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-blue-500  
            hover:from-purple-600 hover:to-blue-600 
            disabled:from-gray-300 disabled:to-gray-400 
            text-white rounded-xl shadow-lg hover:shadow-xl 
            transform hover:scale-105 disabled:scale-100"
              title="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
