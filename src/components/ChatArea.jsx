import React from "react";
import TypingIndicator from "./TypingIndicator";
import MessageBubble from "./MessageBubble";

const ChatArea = ({ messages, isTyping, messagesEndRef }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth relative z-10 custom-scrollbar">
            <div className="max-w-4xl mx-auto pb-4">
                {messages.map((msg, idx) => (
                    <MessageBubble key={idx} message={msg} />
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start mb-6">
                        <TypingIndicator />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatArea;
