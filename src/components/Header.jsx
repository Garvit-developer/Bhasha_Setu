import React from "react";
import { Menu, Sparkles } from "lucide-react";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 px-4 py-3 sm:px-6">
            <div className="max-w-5xl mx-auto flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                            <Sparkles size={16} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
                                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                    Bhaasha Setu
                                </span>
                                <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold border border-indigo-100 uppercase tracking-wide">
                                    Beta
                                </span>
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                    <div className="px-2 py-1 bg-slate-50 text-slate-500 rounded text-xs font-medium border border-slate-200">
                        v1.2.0
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
