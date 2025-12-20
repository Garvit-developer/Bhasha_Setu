import React from "react";
import { Menu, Sparkles } from "lucide-react";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <header
            className="
                sticky top-0 z-30 w-full
                bg-[#0f1117]/90 backdrop-blur
                border-b border-white/5
                px-2 sm:px-2
                h-12
            "
        >
            <div className="h-full flex items-center justify-between w-full px-4  mx-auto">

                {/* Left */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="
                            p-1.5
                            -ml-1.5
                            text-gray-400
                            hover:text-white
                            hover:bg-white/5
                            rounded-md
                            transition
                        "
                        aria-label="Toggle sidebar"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center gap-2.5">
                        <div
                            className="
                                w-7 h-7
                                bg-gradient-to-br from-indigo-500 to-violet-600
                                rounded-md
                                flex items-center justify-center
                                text-white
                                shadow shadow-indigo-500/20
                            "
                        >
                            <Sparkles size={14} />
                        </div>

                        <h1 className="text-sm sm:text-base font-semibold text-gray-100 flex items-center gap-2">
                            Bhasha Setu
                            <span
                                className="
                                    px-1.5 py-[1px]
                                    bg-indigo-500/10
                                    text-indigo-400
                                    rounded
                                    text-[9px]
                                    font-semibold
                                    border border-indigo-500/20
                                    uppercase tracking-wide
                                "
                            >
                                Beta
                            </span>
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
