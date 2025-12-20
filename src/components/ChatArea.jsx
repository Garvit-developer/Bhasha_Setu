import React from "react";
import TypingIndicator from "./TypingIndicator";
import MessageBubble from "./MessageBubble";

const ChatArea = ({ messages, isTyping, messagesEndRef }) => {
    return (
        <div className="
            flex-1 overflow-y-auto
            bg-[#0f1117]
            px-4 sm:px-6 py-6
            scroll-smooth
            custom-scrollbar
        ">
            <div className="max-w-3xl mx-auto space-y-4 pb-6">
                {messages.map((msg, idx) => (
                    <MessageBubble key={idx} message={msg} />
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <TypingIndicator />
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatArea;
