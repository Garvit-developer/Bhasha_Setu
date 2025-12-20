// import React, { useState } from 'react';
// import { toast } from 'sonner';
// import ReactMarkdown from 'react-markdown';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { Copy, Check, Bot, User, Volume2 } from 'lucide-react';
// import { motion } from 'framer-motion';
// import clsx from 'clsx';

// const MessageBubble = ({ message }) => {
//     const isAssistant = message.role === 'assistant';
//     const [copied, setCopied] = useState(false);

//     const handleCopy = (text) => {
//         navigator.clipboard.writeText(text);
//         setCopied(true);
//         toast.success("Copied to clipboard!");
//         setTimeout(() => setCopied(false), 2000);
//     };

//     const handleSpeak = (type) => {
//         if ('speechSynthesis' in window) {
//             window.speechSynthesis.cancel();

//             const content = typeof message.content === 'string' ? message.content : "Content not available";
//             let textToSpeak = content;

//             const translitStartRegex = /Transliteration.*?:/i;
//             const translationStartRegex = /Translation.*?:/i;

//             const startMatch = content.match(translitStartRegex);
//             const translationMatch = content.match(translationStartRegex);

//             if (type === 'transliteration') {
//                 if (startMatch) {
//                     const startIndex = startMatch.index + startMatch[0].length;
//                     const endIndex = translationMatch ? translationMatch.index : content.length;
//                     textToSpeak = content.substring(startIndex, endIndex);
//                 } else {
//                     if (translationMatch) {
//                         textToSpeak = content.substring(0, translationMatch.index);
//                     }
//                 }
//             } else if (type === 'translation') {
//                 if (translationMatch) {
//                     const startIndex = translationMatch.index + translationMatch[0].length;
//                     textToSpeak = content.substring(startIndex);
//                 } else {
//                     toast.error("No translation found to read.");
//                     return;
//                 }
//             }

//             textToSpeak = textToSpeak.replace(/^["']|["']$/g, '').trim();
//             textToSpeak = textToSpeak.replace(/^[*_]+|[*_]+$/g, '').trim();

//             console.log(`[TTS Debug] Type: ${type}, Text:`, textToSpeak);

//             if (textToSpeak) {
//                 const utterance = new SpeechSynthesisUtterance(textToSpeak);

//                 const voices = window.speechSynthesis.getVoices();
//                 console.log(`[TTS Debug] Available voices: ${voices.length}`);

//                 const hasDevanagari = /[\u0900-\u097F]/.test(textToSpeak);
//                 if (hasDevanagari) {
//                     utterance.lang = 'hi-IN';
//                 }
//                 console.log(`[TTS Debug] Setting lang to: ${utterance.lang}`);

//                 utterance.onstart = () => console.log("[TTS Debug] Speech started");
//                 utterance.onend = () => console.log("[TTS Debug] Speech ended");
//                 utterance.onerror = (e) => console.error("[TTS Debug] Speech error:", e);

//                 window.speechSynthesis.speak(utterance);
//             } else {
//                 toast.error("Could not extract text to speak.");
//             }
//         } else {
//             alert("Text-to-Speech is not supported in this browser.");
//         }
//     };

//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.2 }}
//             className={clsx(
//                 "flex w-full gap-4 mb-6",
//                 message.role === "user" ? "justify-end" : "justify-start"
//             )}
//         >
//             <div className={clsx(
//                 "flex max-w-[90%] sm:max-w-[80%] gap-3",
//                 message.role === "user" ? "flex-row-reverse" : "flex-row"
//             )}>
//                 {/* Avatar */}
//                 <div className={clsx(
//                     "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105",
//                     isAssistant
//                         ? "bg-white text-indigo-600 border border-indigo-100"
//                         : "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-indigo-500/20"
//                 )}>
//                     {isAssistant ? <Bot size={18} /> : <User size={16} />}
//                 </div>

//                 {/* Message Content */}
//                 <div className={clsx(
//                     "flex flex-col min-w-0",
//                     message.role === "user" ? "items-end" : "items-start"
//                 )}>
//                     <div className={clsx(
//                         "px-5 py-3.5 rounded-2xl shadow-sm relative group overflow-hidden transition-all duration-200",
//                         isAssistant
//                             ? "bg-white text-slate-800 border border-slate-200/60 rounded-tl-none hover:shadow-md"
//                             : "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-indigo-500/20 rounded-tr-none hover:shadow-indigo-500/30"
//                     )}>
//                         {message.image && (
//                             <div className="mb-3 rounded-md overflow-hidden border border-slate-200">
//                                 <img
//                                     src={URL.createObjectURL(message.image)}
//                                     alt="Uploaded content"
//                                     className="max-w-full h-auto max-h-80 object-cover"
//                                 />
//                             </div>
//                         )}

//                         <div className={clsx(
//                             "text-sm leading-relaxed prose prose-sm max-w-none break-words prose-slate",
//                             // Ensure code blocks look good in both bubbles
//                         )}>
//                             {typeof message.content === 'string' ? (
//                                 <ReactMarkdown
//                                     components={{
//                                         code({ node, inline, className, children, ...props }) {
//                                             const match = /language-(\w+)/.exec(className || '');
//                                             return !inline && match ? (
//                                                 <div className="relative group/code my-3 rounded-md overflow-hidden border border-slate-200">
//                                                     <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-200">
//                                                         <span className="text-xs font-mono text-slate-500">{match[1]}</span>
//                                                         <button
//                                                             onClick={() => handleCopy(String(children).replace(/\n$/, ''))}
//                                                             className="text-slate-400 hover:text-slate-700 transition-colors"
//                                                             title="Copy code"
//                                                         >
//                                                             {copied ? <Check size={14} /> : <Copy size={14} />}
//                                                         </button>
//                                                     </div>
//                                                     <SyntaxHighlighter
//                                                         style={oneDark}
//                                                         language={match[1]}
//                                                         PreTag="div"
//                                                         customStyle={{ margin: 0, borderRadius: 0 }}
//                                                         {...props}
//                                                     >
//                                                         {String(children).replace(/\n$/, '')}
//                                                     </SyntaxHighlighter>
//                                                 </div>
//                                             ) : (
//                                                 <code className="px-1 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-800 border border-slate-200" {...props}>
//                                                     {children}
//                                                 </code>
//                                             );
//                                         }
//                                     }}
//                                 >
//                                     {message.content}
//                                 </ReactMarkdown>
//                             ) : (
//                                 "Content not available"
//                             )}
//                         </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex items-center gap-3 mt-2 px-1 transition-opacity">
//                         <span className="text-[10px] text-slate-400 font-medium">
//                             {message.timestamp}
//                         </span>
//                         {isAssistant && (
//                             <>
//                                 <button
//                                     onClick={() => handleCopy(message.content)}
//                                     className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
//                                     title="Copy message"
//                                 >
//                                     {copied ? <Check size={16} /> : <Copy size={16} />}
//                                 </button>

//                                 <div className="h-4 w-px bg-slate-200 mx-1"></div>

//                                 <button
//                                     onClick={() => handleSpeak('transliteration')}
//                                     className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
//                                     title="Read Transliteration"
//                                 >
//                                     <Volume2 size={16} />
//                                     <span className="text-xs font-medium">Transliteration</span>
//                                 </button>

//                                 <button
//                                     onClick={() => handleSpeak('translation')}
//                                     className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors"
//                                     title="Read Translation"
//                                 >
//                                     <Volume2 size={16} />
//                                     <span className="text-xs font-medium">Translation</span>
//                                 </button>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </motion.div>
//     );
// };

// export default MessageBubble;






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
                                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
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
