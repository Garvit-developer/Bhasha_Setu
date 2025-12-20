// import React from "react";
// import { Menu, Sparkles } from "lucide-react";

// const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
//     return (
//         <header className="
//             sticky top-0 z-30 w-full
//             bg-[#0f1117]/90 backdrop-blur
//             border-b border-white/5
//             px-4 sm:px-6 py-3
//         ">
//             <div className="flex items-center justify-between max-w-7xl mx-auto">

//                 {/* Left Section */}
//                 <div className="flex items-center gap-4">
//                     <button
//                         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                         className="
//                             p-2 -ml-2
//                             text-gray-400
//                             hover:text-white
//                             hover:bg-white/5
//                             rounded-md
//                             transition
//                         "
//                         aria-label="Toggle sidebar"
//                     >
//                         <Menu size={22} />
//                     </button>

//                     <div className="flex items-center gap-3">
//                         <div className="
//                             w-8 h-8
//                             bg-gradient-to-br from-indigo-500 to-violet-600
//                             rounded-lg
//                             flex items-center justify-center
//                             text-white
//                             shadow-lg shadow-indigo-500/20
//                         ">
//                             <Sparkles size={16} />
//                         </div>

//                         <h1 className="text-base sm:text-lg font-semibold tracking-tight text-gray-100 flex items-center gap-2">
//                             Bhaasha Setu
//                             <span className="
//                                 px-1.5 py-0.5
//                                 bg-indigo-500/10
//                                 text-indigo-400
//                                 rounded
//                                 text-[10px]
//                                 font-semibold
//                                 border border-indigo-500/20
//                                 uppercase tracking-wide
//                             ">
//                                 Beta
//                             </span>
//                         </h1>
//                     </div>
//                 </div>

//                 {/* Right Section */}
//                 <div className="hidden sm:flex items-center gap-2">
//                     <span className="
//                         px-2 py-1
//                         text-xs font-medium
//                         text-gray-400
//                         bg-white/5
//                         border border-white/10
//                         rounded
//                     ">
//                         v1.2.0
//                     </span>
//                 </div>
//             </div>
//         </header>
//     );
// };

// export default Header;


import React from "react";
import { Menu, Sparkles } from "lucide-react";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <header
            className="
                sticky top-0 z-30 w-full
                bg-[#0f1117]/90 backdrop-blur
                border-b border-white/5
                px-4 sm:px-6
                h-12
            "
        >
            <div className="h-full flex items-center justify-between max-w-7xl mx-auto">

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
                            Bhaasha Setu
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

                {/* Right */}
                <div className="hidden sm:flex items-center">
                    <span
                        className="
                            px-2 py-0.5
                            text-[10px]
                            font-medium
                            text-gray-400
                            bg-white/5
                            border border-white/10
                            rounded
                        "
                    >
                        v1.2.0
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;
