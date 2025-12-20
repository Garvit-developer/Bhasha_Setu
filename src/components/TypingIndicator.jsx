import React from "react";
import { Bot } from "lucide-react";
import { motion } from "framer-motion";

const TypingIndicator = () => (
    <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3"
    >
        {/* Avatar */}
        <div className="
            w-9 h-9
            flex items-center justify-center
            rounded-xl shrink-0
            bg-[#1c1f26]
            border border-white/10
            text-indigo-400
            shadow-md
        ">
            <Bot size={18} />
        </div>

        {/* Bubble */}
        <div className="
            bg-[#1c1f26]
            border border-white/10
            px-4 py-3
            rounded-2xl rounded-tl-none
        ">
            <div className="flex items-center gap-1 h-4">
                <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.15,
                    }}
                />
                <motion.span
                    className="w-1.5 h-1.5 rounded-full bg-gray-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3,
                    }}
                />
            </div>
        </div>
    </motion.div>
);

export default TypingIndicator;
