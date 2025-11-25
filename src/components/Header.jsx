import React from "react";
import { Menu, Sparkles } from "lucide-react";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 sticky top-0 z-20 px-4 py-4 sm:px-6 shadow-sm">
            <div className="max-w-5xl mx-auto flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white ring-4 ring-white/50">
                            <Sparkles size={20} className="sm:w-6 sm:h-6" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight">
                                Bhaasha Setu
                            </h1>
                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide uppercase">
                                Indian Script Transliterator
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold border border-indigo-100">
                        Beta
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
