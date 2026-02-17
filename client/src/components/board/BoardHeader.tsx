import { useState } from 'react';
import { Rocket, Search, Users, History } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBoardStore } from '../../store/boardStore';
import { BoardMembersPanel } from './BoardMembersPanel';

interface BoardHeaderProps {
    title: string;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onToggleActivity?: () => void;
}

export const BoardHeader = ({ title, searchQuery, setSearchQuery, onToggleActivity }: BoardHeaderProps) => {
    const { user } = useAuthStore();
    const { currentBoard } = useBoardStore();
    const [showMembersPanel, setShowMembersPanel] = useState(false);

    const memberCount = currentBoard?.boardMembers?.length || 0;

    return (
        <>
            <header className="shrink-0 mb-6 z-30 relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#1e1d2b] dark:bg-[#161b22] text-white shadow-lg shadow-black/5 rounded-2xl px-6 py-4 gap-4 md:gap-0">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-[#5048e5]/10 text-[#5048e5] rounded-xl flex items-center justify-center shrink-0 border border-[#5048e5]/20">
                            <Rocket className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-white text-lg font-bold leading-none tracking-tight">{title}</h2>
                            <p className="text-[10px] text-[#656487] font-bold mt-1 uppercase tracking-wider">Board</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative hidden md:block group mr-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#656487] group-focus-within:text-[#5048e5] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 text-sm bg-[#121117] border border-transparent focus:border-[#5048e5]/50 rounded-xl focus:ring-0 w-64 text-[#656487] placeholder-[#656487] transition-all"
                            />
                        </div>

                        {/* Members Button */}
                        <button
                            onClick={() => setShowMembersPanel(true)}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-[#656487] hover:bg-[#121117] hover:text-white rounded-xl transition-all"
                            title="Manage Members"
                        >
                            <Users className="w-5 h-5" />
                            <span className="bg-[#5048e5] text-white text-[10px] px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                                {memberCount}
                            </span>
                        </button>

                        {/* Activity History Button */}
                        {onToggleActivity && (
                            <button
                                onClick={onToggleActivity}
                                className="p-2 text-[#656487] hover:text-white hover:bg-[#121117] rounded-xl transition-all"
                                title="Activity History"
                            >
                                <History className="w-5 h-5" />
                            </button>
                        )}

                        <div className="flex items-center gap-3 pl-2 border-l border-[#2a2938] ml-1">
                            <div className="text-right hidden xl:block leading-tight">
                                <p className="text-xs font-bold text-white">{user?.name}</p>
                            </div>
                            <div className="relative">
                                <div className="h-9 w-9 rounded-xl bg-white text-[#121121] font-bold flex items-center justify-center text-sm border-2 border-[#1e1d2b]">
                                    {user?.name?.charAt(0).toUpperCase().slice(0, 2) || 'U'}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#1e1d2b] rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Members Panel */}
            <BoardMembersPanel
                isOpen={showMembersPanel}
                onClose={() => setShowMembersPanel(false)}
            />
        </>
    );
};
