import React, { useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Bot, User, Volume2, Square } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";

const MessageBubble = ({ message }) => {
    const isAssistant = message.role === "assistant";
    const [copied, setCopied] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentSpeakingType, setCurrentSpeakingType] = useState(null);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleStopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setCurrentSpeakingType(null);
    };

    const handleSpeak = (type) => {
        if (!("speechSynthesis" in window)) {
            toast.error("Text-to-Speech not supported");
            return;
        }

        window.speechSynthesis.cancel();

        const content =
            typeof message.content === "string"
                ? message.content
                : "Content not available";

        let textToSpeak = "";

        // Try multiple extraction strategies
        const translitPattern = /(?:\*\*|##)?\s*Transliteration\s*(?:\*\*|##)?[\s:(-]*/gi;
        const translationPattern = /(?:\*\*|##)?\s*Translation\s*(?:\*\*|##)?[\s:(-]*/gi;

        const translitMatch = content.match(translitPattern);
        const translationMatch = content.match(translationPattern);

        if (type === "transliteration") {
            if (translitMatch) {
                const translitIndex = content.search(translitPattern);
                const matchLength = translitMatch[0].length;
                const start = translitIndex + matchLength;

                let end = content.length;
                if (translationMatch) {
                    const translationIndex = content.search(translationPattern);
                    if (translationIndex > translitIndex) {
                        end = translationIndex;
                    }
                }

                textToSpeak = content.substring(start, end);
            } else {
                const lines = content.split('\n');
                const translitLineIndex = lines.findIndex(line =>
                    /transliteration/i.test(line)
                );
                if (translitLineIndex !== -1 && translitLineIndex + 1 < lines.length) {
                    textToSpeak = lines[translitLineIndex + 1];
                }
            }
        } else if (type === "translation") {
            if (translationMatch) {
                const translationIndex = content.search(translationPattern);
                const matchLength = translationMatch[0].length;
                const start = translationIndex + matchLength;

                let endText = content.substring(start);

                const paragraphEnd = endText.search(/\n\n/);
                const sectionMarkers = /(?:\*\*|##)\s*[A-Z]/;
                const sectionEnd = endText.search(sectionMarkers);

                let cutoff = endText.length;
                if (paragraphEnd !== -1 && paragraphEnd < cutoff) cutoff = paragraphEnd;
                if (sectionEnd !== -1 && sectionEnd < cutoff) cutoff = sectionEnd;

                textToSpeak = endText.substring(0, cutoff);
            } else {
                const lines = content.split('\n');
                const translationLineIndex = lines.findIndex(line =>
                    /translation/i.test(line)
                );
                if (translationLineIndex !== -1 && translationLineIndex + 1 < lines.length) {
                    textToSpeak = lines[translationLineIndex + 1];
                }
            }
        }

        textToSpeak = textToSpeak
            .replace(/[*_`#"]/g, "")
            .replace(/^[\s:-]+/, "")
            .trim();

        if (!textToSpeak) {
            toast.error(`Could not find ${type} content`);
            console.log("Content:", content);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        if (/[\u0900-\u097F]/.test(textToSpeak)) {
            utterance.lang = "hi-IN";
        } else if (/[\u0980-\u09FF]/.test(textToSpeak)) {
            utterance.lang = "bn-IN";
        } else if (/[\u0B80-\u0BFF]/.test(textToSpeak)) {
            utterance.lang = "ta-IN";
        } else if (/[\u0C00-\u0C7F]/.test(textToSpeak)) {
            utterance.lang = "te-IN";
        } else if (/[\u0A80-\u0AFF]/.test(textToSpeak)) {
            utterance.lang = "gu-IN";
        } else if (/[\u0C80-\u0CFF]/.test(textToSpeak)) {
            utterance.lang = "kn-IN";
        } else if (/[\u0D00-\u0D7F]/.test(textToSpeak)) {
            utterance.lang = "ml-IN";
        } else {
            utterance.lang = "en-IN";
        }

        utterance.onstart = () => {
            setIsSpeaking(true);
            setCurrentSpeakingType(type);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setCurrentSpeakingType(null);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
            setCurrentSpeakingType(null);
        };

        window.speechSynthesis.speak(utterance);
    };

    const hasTransliterationContent = () => {
        const content = typeof message.content === "string" ? message.content : "";
        return /(?:\*\*|##)?\s*Transliteration\s*(?:\*\*|##)?[\s:(-]/i.test(content);
    };

    const hasTranslationContent = () => {
        const content = typeof message.content === "string" ? message.content : "";
        return /(?:\*\*|##)?\s*Translation\s*(?:\*\*|##)?[\s:(-]/i.test(content);
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
                <div
                    className={clsx(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md",
                        isAssistant
                            ? "bg-[#1c1f26] text-indigo-400 border border-white/10"
                            : "bg-gradient-to-r from-[#0a6a90]/70 to-[#05a3a6]/70 text-white shadow-indigo-500/30"
                    )}
                >
                    {isAssistant ? <Bot size={18} /> : <User size={16} />}
                </div>

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
                                : "bg-gradient-to-r from-[#0a6a90]/70 to-[#05a3a6]/70 text-white rounded-tr-none shadow-lg shadow-indigo-500/25"
                        )}
                    >
                        {(() => {
                            let imageSrc = null;
                            try {
                                if (typeof message.image === "string" && message.image.trim() !== "") {
                                    imageSrc = message.image;
                                } else if (message.image instanceof File || message.image instanceof Blob) {
                                    imageSrc = URL.createObjectURL(message.image);
                                }
                            } catch (e) {
                                console.error("Error creating image URL:", e);
                            }

                            if (!imageSrc) return null;

                            return (
                                <img
                                    src={imageSrc}
                                    alt="Uploaded"
                                    className="mb-3 rounded-lg border border-white/10 max-h-80 object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            );
                        })()}

                        <div className="prose prose-invert prose-sm max-w-none break-words">
                            <ReactMarkdown
                                components={{
                                    code({
                                        inline,
                                        className,
                                        children,
                                        ...props
                                    }) {
                                        const match = /language-(\w+)/.exec(className || "");

                                        return !inline && match ? (
                                            <div className="my-3 overflow-hidden rounded-lg border border-white/10">
                                                <div className="flex items-center justify-between px-3 py-1 bg-[#0f1117] border-b border-white/10">
                                                    <span className="text-xs text-gray-400 font-mono">
                                                        {match[1]}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleCopy(
                                                                String(children).replace(/\n$/, "")
                                                            )
                                                        }
                                                        className="text-gray-400 hover:text-indigo-400"
                                                    >
                                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                                    </button>
                                                </div>
                                                <SyntaxHighlighter
                                                    style={oneDark}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    customStyle={{ margin: 0 }}
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, "")}
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

                    <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                        <span>{message.timestamp}</span>

                        {isAssistant && (
                            <>
                                <button
                                    onClick={() => handleCopy(message.content)}
                                    className="hover:text-indigo-400 transition"
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                </button>

                                {(hasTransliterationContent() || hasTranslationContent()) && (
                                    <>
                                        <div className="w-px h-3 bg-white/10" />

                                        {hasTransliterationContent() && (
                                            <button
                                                onClick={() => handleSpeak("transliteration")}
                                                className={clsx(
                                                    "flex items-center gap-1 transition",
                                                    currentSpeakingType === "transliteration"
                                                        ? "text-indigo-400 animate-pulse"
                                                        : "text-indigo-300 hover:text-indigo-200"
                                                )}
                                                disabled={isSpeaking && currentSpeakingType !== "transliteration"}
                                            >
                                                <Volume2 size={14} />
                                                Transliteration
                                            </button>
                                        )}

                                        {hasTranslationContent() && (
                                            <button
                                                onClick={() => handleSpeak("translation")}
                                                className={clsx(
                                                    "flex items-center gap-1 transition",
                                                    currentSpeakingType === "translation"
                                                        ? "text-violet-400 animate-pulse"
                                                        : "text-violet-400 hover:text-violet-300"
                                                )}
                                                disabled={isSpeaking && currentSpeakingType !== "translation"}
                                            >
                                                <Volume2 size={14} />
                                                Translation
                                            </button>
                                        )}

                                        {isSpeaking && (
                                            <>
                                                <div className="w-px h-3 bg-white/10" />
                                                <button
                                                    onClick={handleStopSpeaking}
                                                    className="flex items-center gap-1 text-red-400 hover:text-red-300 transition"
                                                >
                                                    <Square size={14} />
                                                    Stop
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;
