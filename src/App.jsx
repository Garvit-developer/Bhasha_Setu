import React, { useState, useRef, useEffect } from "react";
import { Toaster, toast } from 'sonner';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatArea from "./components/ChatArea";
import InputArea from "./components/InputArea";

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
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    // Initialize with a new chat if no sessions or just to start fresh
    useEffect(() => {
        if (
            !currentSessionId &&
            messages.length === 1 &&
            messages[0].role === "assistant"
        ) {
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
            toast.error("Failed to send message. Please try again.");

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

    return (
        <div className="h-screen w-full flex flex-col font-sans text-slate-900 bg-slate-50 relative overflow-hidden">
            {/* Vibrant Modern Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-sky-400/10 blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Top Navigation Bar */}
            <Header
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="flex-1 flex overflow-hidden relative z-10">
                <Sidebar
                    sessions={sessions}
                    currentSessionId={currentSessionId}
                    createNewChat={createNewChat}
                    loadSession={loadSession}
                    deleteSession={deleteSession}
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full relative w-full min-w-0">
                    <ChatArea
                        messages={messages}
                        isTyping={isTyping}
                        messagesEndRef={messagesEndRef}
                    />

                    <InputArea
                        inputText={inputText}
                        setInputText={setInputText}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        fileInputRef={fileInputRef}
                        handleSend={handleSend}
                        handleKeyPress={handleKeyPress}
                        isLoading={isLoading}
                    />
                </div>
            </div>
            <Toaster position="top-center" richColors />
        </div>
    );
};

export default App;
