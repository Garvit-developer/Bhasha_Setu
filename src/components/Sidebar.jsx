import React from "react";
import { Plus, MessageSquare, Trash2, User, History, ChevronLeft } from "lucide-react";
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
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={clsx(
                    "fixed md:relative z-40 h-full w-72 flex flex-col transition-transform duration-300 ease-out",
                    "bg-slate-900 border-r border-slate-800 text-slate-300",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-6 md:hidden">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white">Bhaasha Setu</span>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 text-slate-400 hover:bg-slate-800 rounded-md"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>

                    <button
                        onClick={createNewChat}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg shadow-lg shadow-indigo-900/20 transition-all hover:shadow-indigo-900/40 group border border-indigo-500/20"
                    >
                        <Plus size={18} className="text-indigo-100 group-hover:text-white transition-colors" />
                        <span className="font-semibold text-sm tracking-wide">New Chat</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Recent
                    </div>

                    {sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-600 text-sm gap-3">
                            <History size={24} className="opacity-20" />
                            <p>No chat history</p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <div
                                key={session.id}
                                onClick={() => loadSession(session.id)}
                                className={clsx(
                                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 border",
                                    currentSessionId === session.id
                                        ? "bg-slate-800 text-white border-slate-700 shadow-sm"
                                        : "hover:bg-slate-800/50 text-slate-400 border-transparent hover:border-slate-800"
                                )}
                            >
                                <MessageSquare
                                    size={16}
                                    className={clsx(
                                        "shrink-0 transition-colors",
                                        currentSessionId === session.id ? "text-indigo-400" : "text-slate-600 group-hover:text-slate-400"
                                    )}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className={clsx(
                                        "text-sm font-medium truncate transition-colors",
                                        currentSessionId === session.id ? "text-white" : "text-slate-400 group-hover:text-slate-300"
                                    )}>
                                        {session.title}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => deleteSession(e, session.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 rounded transition-all"
                                    title="Delete chat"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:text-white border border-slate-700">
                            <User size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">User Account</p>
                            <p className="text-xs text-slate-500 truncate">Free Plan</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
