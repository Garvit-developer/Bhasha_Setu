import React from "react";
import { Bot } from "lucide-react";
import { motion } from "framer-motion";

const TypingIndicator = () => (
    <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start space-x-3"
    >
        <div className="w-8 h-8 flex items-center justify-center bg-white text-slate-600 rounded-lg shrink-0 border border-slate-200">
            <Bot size={16} />
        </div>
        <div className="bg-white px-4 py-3 rounded-lg rounded-tl-none border border-slate-200">
            <div className="flex items-center gap-1 h-4">
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                />
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                />
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                />
            </div>
        </div>
    </motion.div>
);

export default TypingIndicator;
