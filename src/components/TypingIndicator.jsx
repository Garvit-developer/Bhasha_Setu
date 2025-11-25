import React from "react";
import { Bot } from "lucide-react";

const TypingIndicator = () => (
    <div className="flex items-start space-x-3 animate-fade-in-up">
        <div className="w-8 h-8 flex items-center justify-center bg-white text-indigo-600 rounded-full shrink-0 shadow-sm border border-indigo-100">
            <Bot size={18} />
        </div>
        <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-white/50">
            <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
            </div>
        </div>
    </div>
);

export default TypingIndicator;
