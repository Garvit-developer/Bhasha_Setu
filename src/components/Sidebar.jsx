import React from "react";
import {
    Plus,
    MessageSquare,
    Trash2,
    User,
    History,
    ChevronLeft,
} from "lucide-react";
import clsx from "clsx";

const Sidebar = ({
    sessions,
    currentSessionId,
    createNewChat,
    loadSession,
    deleteSession,
    isSidebarOpen,
    setIsSidebarOpen,
}) => {
    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed md:relative z-40 h-full",
                    "bg-[#0f1117] border-r border-white/5",
                    "transition-[width,transform] duration-300 ease-in-out",
                    isSidebarOpen
                        ? "translate-x-0 w-72"
                        : "-translate-x-full md:translate-x-0 md:w-0 md:border-none overflow-hidden"
                )}
            >
                {/* 
                    IMPORTANT:
                    Inner content fades in AFTER sidebar opens
                */}
                <div
                    className={clsx(
                        "w-72 h-full flex flex-col",
                        "transition-opacity duration-200 ease-out",
                        isSidebarOpen
                            ? "opacity-100 delay-200 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                    )}
                >
                    {/* Top */}
                    <div className="p-4">
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between mb-5 md:hidden">
                            <span className="font-semibold text-gray-100">
                                Bhaasha Setu
                            </span>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 rounded-md text-gray-400 hover:bg-white/5 transition"
                            >
                                <ChevronLeft size={18} />
                            </button>
                        </div>

                        {/* New Chat */}
                        <button
                            onClick={createNewChat}
                            className="
                                w-full flex items-center gap-3
                                px-4 py-3 rounded-lg
                                bg-gradient-to-r from-indigo-500 to-violet-600
                                text-white text-sm font-semibold
                                shadow-lg shadow-indigo-500/25
                                hover:shadow-indigo-500/40
                                transition
                            "
                        >
                            <Plus size={18} />
                            New Chat
                        </button>
                    </div>

                    {/* Sessions */}
                    <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
                        <p className="px-3 py-2 text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                            Recent
                        </p>

                        {sessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14 text-gray-500 gap-3 text-sm">
                                <History size={26} className="opacity-30" />
                                No chat history
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {sessions.map((session) => (
                                    <div
                                        key={session.id}
                                        onClick={() =>
                                            loadSession(session.id)
                                        }
                                        className={clsx(
                                            "group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition border",
                                            currentSessionId === session.id
                                                ? "bg-white/5 border-white/10 text-gray-100"
                                                : "border-transparent text-gray-400 hover:bg-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <MessageSquare
                                            size={16}
                                            className={clsx(
                                                "shrink-0",
                                                currentSessionId === session.id
                                                    ? "text-indigo-400"
                                                    : "text-gray-500 group-hover:text-gray-300"
                                            )}
                                        />

                                        <p className="flex-1 text-sm truncate font-medium">
                                            {session.title}
                                        </p>

                                        <button
                                            onClick={(e) =>
                                                deleteSession(e, session.id)
                                            }
                                            className="
                                                opacity-0 group-hover:opacity-100
                                                p-1 rounded
                                                text-gray-500 hover:text-red-400
                                                transition
                                            "
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/5">
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition cursor-pointer">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#1c1f26] border border-white/10 text-gray-400">
                                <User size={16} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-200">
                                    User Account
                                </p>
                                <p className="text-xs text-gray-500">
                                    Free Plan
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
