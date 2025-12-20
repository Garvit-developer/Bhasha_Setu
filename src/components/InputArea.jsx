import React from "react";
import { Send, X, Loader2, Paperclip, Mic, MicOff, Globe } from "lucide-react";
import VoiceVisualizer from "./VoiceVisualizer";

const InputArea = ({
    inputText,
    setInputText,
    selectedImage,
    setSelectedImage,
    fileInputRef,
    handleSend,
    handleKeyPress,
    isLoading,
}) => {
    const [isListening, setIsListening] = React.useState(false);
    const [selectedLanguage, setSelectedLanguage] = React.useState("hi-IN");
    const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);

    const languages = [
        { code: "hi-IN", name: "Hindi" },
        { code: "bn-IN", name: "Bengali" },
        { code: "ta-IN", name: "Tamil" },
        { code: "te-IN", name: "Telugu" },
        { code: "mr-IN", name: "Marathi" },
        { code: "gu-IN", name: "Gujarati" },
        { code: "kn-IN", name: "Kannada" },
        { code: "ml-IN", name: "Malayalam" },
        { code: "pa-IN", name: "Punjabi" },
        { code: "en-IN", name: "English (India)" },
    ];

    const handleVoiceInput = () => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = selectedLanguage;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputText((prev) => prev + (prev ? " " : "") + transcript);
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    return (
        <div className="
            sticky bottom-0 z-30
            bg-[#0f1117]
            border-t border-white/5
            px-4 py-1.5
        ">
            <div className="max-w-3xl mx-auto relative">
                {/* Image Preview */}
                {selectedImage && (
                    <div className="
                        absolute bottom-full mb-3 left-0
                        bg-[#1c1f26]
                        border border-white/10
                        rounded-xl p-2 shadow-xl
                    ">
                        <div className="relative">
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Preview"
                                className="h-20 w-20 rounded-lg object-cover border border-white/10"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="
                                    absolute -top-2 -right-2
                                    p-1 rounded-full
                                    bg-[#0f1117]
                                    text-gray-400
                                    hover:text-red-400
                                    border border-white/10
                                "
                            >
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Input Container */}
                <div className="
                    flex items-end gap-2
                    bg-[#1c1f26]
                    border border-white/10
                    rounded-xl p-2
                    transition
                ">
                    {/* Language */}
                    <div className="relative">
                        <button
                            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                            className="
                                p-2 rounded-lg
                                text-gray-400
                                hover:text-indigo-400
                                hover:bg-white/5
                                transition
                            "
                        >
                            <Globe size={18} />
                        </button>

                        {showLanguageMenu && (
                            <div className="
                                absolute bottom-full mb-1 left-0
                                w-48 max-h-60 overflow-y-auto
                                bg-[#1c1f26]
                                border border-white/10
                                rounded-lg shadow-xl py-1 z-50
                            ">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setSelectedLanguage(lang.code);
                                            setShowLanguageMenu(false);
                                        }}
                                        className={`
                                            w-full text-left px-4 py-2 text-sm
                                            hover:bg-white/5 transition
                                            ${selectedLanguage === lang.code
                                                ? "text-indigo-400 bg-indigo-500/10 font-medium"
                                                : "text-gray-300"
                                            }
                                        `}
                                    >
                                        {lang.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Attach */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="
                            p-2 rounded-lg
                            text-gray-400
                            hover:text-indigo-400
                            hover:bg-white/5
                        "
                    >
                        <Paperclip size={18} />
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                setSelectedImage(e.target.files[0]);
                            }
                        }}
                    />

                    {/* Textarea */}
                    <div className="flex-1 relative">
                        {isListening ? (
                            <div className="
                                absolute inset-0
                                flex items-center justify-center
                                bg-[#1c1f26] z-10
                            ">
                                <VoiceVisualizer />
                                <span className="ml-2 text-sm text-indigo-400 animate-pulse">
                                    Listening ({languages.find(l => l.code === selectedLanguage)?.name})…
                                </span>
                            </div>
                        ) : (
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={`Message Bhaasha Setu (${languages.find(l => l.code === selectedLanguage)?.name})…`}
                                rows={1}
                                className="
                                    w-full resize-none
                                    bg-transparent
                                    text-gray-100
                                    placeholder:text-gray-500
                                    text-sm leading-relaxed
                                    outline-none ring-0 focus:outline-none focus:ring-0
                                "
                                style={{ minHeight: "24px" }}
                            />
                        )}
                    </div>

                    {/* Mic */}
                    <button
                        onClick={handleVoiceInput}
                        className={`
                            p-2 rounded-lg transition
                            ${isListening
                                ? "text-red-400 bg-red-500/10 animate-pulse"
                                : "text-gray-400 hover:text-indigo-400 hover:bg-white/5"
                            }
                        `}
                    >
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>

                    {/* Send */}
                    <button
                        onClick={handleSend}
                        disabled={(!inputText.trim() && !selectedImage) || isLoading}
                        className={`
                            p-2 rounded-lg
                            flex items-center justify-center
                            transition
                            ${inputText.trim() || selectedImage
                                ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-105"
                                : "bg-white/5 text-gray-600 cursor-not-allowed"
                            }
                        `}
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </div>

                {/* Disclaimer */}
                <p className="mt-1 text-center text-[10px] text-gray-500 tracking-wide">
                    Bhaasha Setu may make mistakes. Verify critical information.
                </p>
            </div>
        </div>
    );
};

export default InputArea;
