import React, { useState } from 'react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Bot, User, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const MessageBubble = ({ message }) => {
    const isAssistant = message.role === 'assistant';
    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSpeak = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(typeof message.content === 'string' ? message.content : "Content not available");
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Text-to-Speech is not supported in this browser.");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={clsx(
                "flex w-full gap-4 mb-6",
                message.role === "user" ? "justify-end" : "justify-start"
            )}
        >
            <div className={clsx(
                "flex max-w-[90%] sm:max-w-[80%] gap-3",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}>
                {/* Avatar */}
                <div className={clsx(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105",
                    isAssistant
                        ? "bg-white text-indigo-600 border border-indigo-100"
                        : "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/20"
                )}>
                    {isAssistant ? <Bot size={18} /> : <User size={16} />}
                </div>

                {/* Message Content */}
                <div className={clsx(
                    "flex flex-col min-w-0",
                    message.role === "user" ? "items-end" : "items-start"
                )}>
                    <div className={clsx(
                        "px-5 py-3.5 rounded-2xl shadow-sm relative group overflow-hidden transition-all duration-200",
                        isAssistant
                            ? "bg-white text-slate-800 border border-slate-200/60 rounded-tl-none hover:shadow-md"
                            : "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-indigo-500/20 rounded-tr-none hover:shadow-indigo-500/30"
                    )}>
                        {message.image && (
                            <div className="mb-3 rounded-md overflow-hidden border border-slate-200">
                                <img
                                    src={URL.createObjectURL(message.image)}
                                    alt="Uploaded content"
                                    className="max-w-full h-auto max-h-80 object-cover"
                                />
                            </div>
                        )}

                        <div className={clsx(
                            "text-sm leading-relaxed prose prose-sm max-w-none break-words prose-slate",
                            // Ensure code blocks look good in both bubbles
                        )}>
                            {typeof message.content === 'string' ? (
                                <ReactMarkdown
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <div className="relative group/code my-3 rounded-md overflow-hidden border border-slate-200">
                                                    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-200">
                                                        <span className="text-xs font-mono text-slate-500">{match[1]}</span>
                                                        <button
                                                            onClick={() => handleCopy(String(children).replace(/\n$/, ''))}
                                                            className="text-slate-400 hover:text-slate-700 transition-colors"
                                                            title="Copy code"
                                                        >
                                                            {copied ? <Check size={14} /> : <Copy size={14} />}
                                                        </button>
                                                    </div>
                                                    <SyntaxHighlighter
                                                        style={oneDark}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        customStyle={{ margin: 0, borderRadius: 0 }}
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                </div>
                                            ) : (
                                                <code className="px-1 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-800 border border-slate-200" {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            ) : (
                                "Content not available"
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-slate-400 font-medium">
                            {message.timestamp}
                        </span>
                        {isAssistant && (
                            <>
                                <button
                                    onClick={() => handleCopy(message.content)}
                                    className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                                    title="Copy message"
                                >
                                    {copied ? <Check size={12} /> : <Copy size={12} />}
                                </button>
                                <button
                                    onClick={handleSpeak}
                                    className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                                    title="Read aloud"
                                >
                                    <Volume2 size={12} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;
