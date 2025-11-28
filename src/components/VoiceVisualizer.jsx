import React from 'react';

const VoiceVisualizer = () => {
    return (
        <div className="flex items-center justify-center gap-1 h-8 px-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div
                    key={i}
                    className="w-1 bg-indigo-600 rounded-full animate-voice-bar"
                    style={{
                        height: '100%',
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.8s'
                    }}
                />
            ))}
        </div>
    );
};

export default VoiceVisualizer;
