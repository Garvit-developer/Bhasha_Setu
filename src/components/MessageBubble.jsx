import React, { useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Bot, User, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

const MessageBubble = ({ message }) => {
    const isAssistant = message.role === "assistant";
    const [copied, setCopied] = useState(false);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSpeak = (type) => {
        if (!("speechSynthesis" in window)) {
            alert("Text-to-Speech is not supported");
            return;
        }

        window.speechSynthesis.cancel();

        const content =
            typeof message.content === "string"
                ? message.content
                : "Content not available";

        let textToSpeak = content;

        const translitRegex = /Transliteration.*?:/i;
        const translationRegex = /Translation.*?:/i;

        const tStart = content.match(translitRegex);
        const trStart = content.match(translationRegex);

        if (type === "transliteration") {
            if (tStart) {
                const start = tStart.index + tStart[0].length;
                const end = trStart ? trStart.index : content.length;
                textToSpeak = content.substring(start, end);
            }
        }

        if (type === "translation") {
            if (trStart) {
                textToSpeak = content.substring(
                    trStart.index + trStart[0].length
                );
            } else {
                toast.error("No translation found");
                return;
            }
        }

        textToSpeak = textToSpeak.replace(/[*_"']/g, "").trim();
        if (!textToSpeak) return;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        if (/[\u0900-\u097F]/.test(textToSpeak)) utterance.lang = "hi-IN";

        window.speechSynthesis.speak(utterance);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={clsx(
                "flex w-full mb-6",
                isAssistant ? "justify-start" : "justify-end"
            )}
        >
            <div
                className={clsx(
                    "flex gap-3 max-w-[92%] sm:max-w-[80%]",
                    isAssistant ? "flex-row" : "flex-row-reverse"
                )}
            >
                {/* Avatar */}
                <div
                    className={clsx(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md",
                        isAssistant
                            ? "bg-[#1c1f26] text-indigo-400 border border-white/10"
                            : "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/30"
                    )}
                >
                    {isAssistant ? <Bot size={18} /> : <User size={16} />}
                </div>

                {/* Message */}
                <div
                    className={clsx(
                        "flex flex-col min-w-0",
                        isAssistant ? "items-start" : "items-end"
                    )}
                >
                    <div
                        className={clsx(
                            "px-5 py-3.5 rounded-2xl relative group transition",
                            isAssistant
                                ? "bg-[#1c1f26] text-gray-200 border border-white/10 rounded-tl-none"
                                : "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/25"
                        )}
                    >
                        {/* Image */}
                        {message.image && (
                            <img
                                src={URL.createObjectURL(message.image)}
                                alt="Uploaded"
                                className="mb-3 rounded-lg border border-white/10 max-h-80 object-cover"
                            />
                        )}

                        {/* Markdown */}
                        <div className="prose prose-invert prose-sm max-w-none break-words">
                            <ReactMarkdown
                                components={{
                                    code({
                                        inline,
                                        className,
                                        children,
                                        ...props
                                    }) {
                                        const match =
                                            /language-(\w+)/.exec(
                                                className || ""
                                            );

                                        return !inline && match ? (
                                            <div className="my-3 overflow-hidden rounded-lg border border-white/10">
                                                <div className="flex items-center justify-between px-3 py-1 bg-[#0f1117] border-b border-white/10">
                                                    <span className="text-xs text-gray-400 font-mono">
                                                        {match[1]}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleCopy(
                                                                String(
                                                                    children
                                                                ).replace(
                                                                    /\n$/,
                                                                    ""
                                                                )
                                                            )
                                                        }
                                                        className="text-gray-400 hover:text-indigo-400"
                                                    >
                                                        {copied ? (
                                                            <Check size={14} />
                                                        ) : (
                                                            <Copy size={14} />
                                                        )}
                                                    </button>
                                                </div>
                                                <SyntaxHighlighter
                                                    style={oneDark}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    customStyle={{ margin: 0 }}
                                                    {...props}
                                                >
                                                    {String(children).replace(
                                                        /\n$/,
                                                        ""
                                                    )}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <code className="px-1 py-0.5 rounded bg-black/30 text-indigo-300 text-xs">
                                                {children}
                                            </code>
                                        );
                                    },
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                        <span>{message.timestamp}</span>

                        {isAssistant && (
                            <>
                                <button
                                    onClick={() =>
                                        handleCopy(message.content)
                                    }
                                    className="hover:text-indigo-400 transition"
                                >
                                    {copied ? (
                                        <Check size={14} />
                                    ) : (
                                        <Copy size={14} />
                                    )}
                                </button>

                                <div className="w-px h-3 bg-white/10" />

                                <button
                                    onClick={() =>
                                        handleSpeak("transliteration")
                                    }
                                    className="flex items-center gap-1 text-indigo-300 hover:text-indigo-200"
                                >
                                    <Volume2 size={14} />
                                    Transliteration
                                </button>

                                <button
                                    onClick={() =>
                                        handleSpeak("translation")
                                    }
                                    className="flex items-center gap-1 text-violet-400 hover:text-violet-300"
                                >
                                    <Volume2 size={14} />
                                    Translation
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
