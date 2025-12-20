// import React from "react";
// import { Bot } from "lucide-react";
// import { motion } from "framer-motion";

// const TypingIndicator = () => (
//     <motion.div
//         initial={{ opacity: 0, y: 5 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex items-start space-x-3"
//     >
//         <div className="w-8 h-8 flex items-center justify-center bg-white text-slate-600 rounded-lg shrink-0 border border-slate-200">
//             <Bot size={16} />
//         </div>
//         <div className="bg-white px-4 py-3 rounded-lg rounded-tl-none border border-slate-200">
//             <div className="flex items-center gap-1 h-4">
//                 <motion.div
//                     animate={{ opacity: [0.4, 1, 0.4] }}
//                     transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
//                     className="w-1.5 h-1.5 bg-slate-400 rounded-full"
//                 />
//                 <motion.div
//                     animate={{ opacity: [0.4, 1, 0.4] }}
//                     transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
//                     className="w-1.5 h-1.5 bg-slate-400 rounded-full"
//                 />
//                 <motion.div
//                     animate={{ opacity: [0.4, 1, 0.4] }}
//                     transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
//                     className="w-1.5 h-1.5 bg-slate-400 rounded-full"
//                 />
//             </div>
//         </div>
//     </motion.div>
// );

// export default TypingIndicator;



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
