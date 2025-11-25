import React from "react";
import { Plus, MessageSquare, Trash2, User, History } from "lucide-react";

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
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:relative z-40 h-full w-72 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    } flex flex-col`}
            >
                <div className="p-4 border-b border-slate-200/50">
                    <button
                        onClick={createNewChat}
                        className="w-full flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        <span className="font-medium">New Chat</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Recent History
                    </div>
                    {sessions.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            <History size={24} className="mx-auto mb-2 opacity-50" />
                            <p>No chat history yet</p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <div
                                key={session.id}
                                onClick={() => loadSession(session.id)}
                                className={`group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${currentSessionId === session.id
                                        ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                                        : "hover:bg-white/50 text-slate-700 border border-transparent"
                                    }`}
                            >
                                <MessageSquare
                                    size={18}
                                    className={
                                        currentSessionId === session.id
                                            ? "text-indigo-600"
                                            : "text-slate-400"
                                    }
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{session.title}</p>
                                    <p className="text-[10px] text-slate-400">
                                        {new Date(session.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => deleteSession(e, session.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Delete chat"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-slate-200/50 bg-white/30">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                            <User size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-700">User</p>
                            <p className="text-xs text-slate-500 truncate">Free Plan</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
