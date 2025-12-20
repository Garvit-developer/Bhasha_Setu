import React from "react";
import { Menu, Sparkles } from "lucide-react";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <header
            className="
                sticky top-0 z-30 w-full
                bg-[#0f1117]/90 backdrop-blur
                border-b border-white/5
                px-2 sm:px-2 py-0.5
                h-15
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
                                w-9 h-10
                                flex items-center justify-center
                                text-white"
                        >
                            <img src="/Logo.png" alt="bhasha setu logo" />
                        </div>

                        <h1 className="text-sm sm:text-base font-semibold text-gray-100 flex items-center gap-2">
                            Bhasha Setu
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
