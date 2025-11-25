import React from "react";
import { Bot, User } from "lucide-react";
import TypingIndicator from "./TypingIndicator";

const ChatArea = ({ messages, isTyping, messagesEndRef }) => {
    return (
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
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "assistant"
                                        ? "bg-white text-indigo-600 border border-indigo-100 shadow-sm"
                                        : "bg-indigo-600 text-white shadow-md"
                                    }`}
                            >
                                {msg.role === "assistant" ? <Bot size={18} /> : <User size={18} />}
                            </div>

                            {/* Message Bubble */}
                            <div
                                className={`flex flex-col max-w-full ${msg.role === "user" ? "items-end" : "items-start"
                                    }`}
                            >
                                <div
                                    className={`px-4 py-3 rounded-2xl shadow-sm relative group ${msg.role === "assistant"
                                            ? "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                                            : "bg-indigo-600 text-white rounded-tr-none"
                                        }`}
                                >
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
                                        {typeof msg.content === "string"
                                            ? msg.content
                                            : "Content not available"}
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
    );
};

export default ChatArea;
