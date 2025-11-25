import React from "react";
import { Send, Image as ImageIcon, X, Loader2 } from "lucide-react";

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
        <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-white/20">
            <div className="max-w-3xl mx-auto relative">
                {selectedImage && (
                    <div className="absolute bottom-full mb-2 left-0 p-2 bg-white rounded-xl shadow-lg border border-slate-100 animate-fade-in-up">
                        <div className="relative">
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Preview"
                                className="h-20 w-20 object-cover rounded-lg"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-end gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                        title="Upload image"
                    >
                        <ImageIcon size={20} />
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
                        placeholder="Type a message..."
                        className="flex-1 max-h-32 py-3 px-2 bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 resize-none text-sm scrollbar-hide"
                        rows={1}
                        style={{ minHeight: "44px" }}
                    />

                    <button
                        onClick={handleSend}
                        disabled={(!inputText.trim() && !selectedImage) || isLoading}
                        className={`p-3 rounded-xl flex items-center justify-center transition-all ${inputText.trim() || selectedImage
                                ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700 active:scale-95"
                                : "bg-slate-100 text-slate-300 cursor-not-allowed"
                            }`}
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Send size={20} />
                        )}
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-slate-400">
                        AI can make mistakes. Please verify important information.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InputArea;
