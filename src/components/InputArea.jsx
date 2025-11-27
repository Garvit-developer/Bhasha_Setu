import React from "react";
import { Send, X, Loader2, Paperclip } from "lucide-react";

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
    return (
        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200/60 relative z-20">
            <div className="max-w-4xl mx-auto relative">
                {selectedImage && (
                    <div className="absolute bottom-full mb-4 left-0 p-3 bg-white rounded-xl shadow-lg border border-slate-200 animate-fade-in-up">
                        <div className="relative group">
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Preview"
                                className="h-20 w-20 object-cover rounded-lg border border-slate-100"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-2 -right-2 p-1 bg-white text-slate-500 border border-slate-200 rounded-full shadow-sm hover:text-red-500 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-end gap-2 p-2 bg-white rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all duration-200">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Upload image"
                    >
                        <Paperclip size={20} />
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
                        placeholder="Message Bhaasha Setu..."
                        className="flex-1 max-h-40 py-2.5 px-2 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 resize-none text-sm leading-relaxed scrollbar-hide font-normal"
                        rows={1}
                        style={{ minHeight: "44px" }}
                    />

                    <button
                        onClick={handleSend}
                        disabled={(!inputText.trim() && !selectedImage) || isLoading}
                        className={`p-2.5 rounded-lg flex items-center justify-center transition-all duration-200 ${inputText.trim() || selectedImage
                            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:scale-105"
                            : "bg-slate-100 text-slate-300 cursor-not-allowed"
                            }`}
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Send size={20} className={inputText.trim() || selectedImage ? "ml-0.5" : ""} />
                        )}
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                        Bhaasha Setu can make mistakes. Check important info.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InputArea;
