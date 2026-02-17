import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBoardStore } from '../store/boardStore';
import { Plus, MoreHorizontal, Clock } from 'lucide-react';

export const DashboardPage = () => {
    const { boards, fetchBoards, createBoard } = useBoardStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState('');

    useEffect(() => {
        fetchBoards();
    }, [fetchBoards]);

    const handleCreateBoard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBoardTitle.trim()) return;

        await createBoard(newBoardTitle, `https://source.unsplash.com/random/800x600?nature,${boards.length}`);
        setNewBoardTitle('');
        setIsModalOpen(false);
    };

    return (
        <div>
            {/* Header Section */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Your Boards</h1>
                    <p className="mt-2 text-sm text-gray-500 dark:text-zinc-400">You have {boards.length} active project boards.</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-500 active:scale-95 shadow-lg shadow-indigo-600/20 dark:shadow-indigo-900/20"
                >
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Create New Board
                </button>
            </div>

            {/* Tabs */}
            <div className="mt-10 border-b border-gray-200 dark:border-white/5">
                <div className="flex gap-8">
                    <button className="relative pb-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        All Boards
                        <span className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600 dark:bg-indigo-500 rounded-t-full" />
                    </button>
                    <button className="pb-4 text-sm font-medium text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors">
                        Personal
                    </button>
                    <button className="pb-4 text-sm font-medium text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors">
                        Team
                    </button>
                </div>
            </div>

            {/* Boards Grid */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {boards.map((board) => (
                    <Link
                        to={`/dashboard/board/${board.id}`}
                        key={board.id}
                        className="group rounded-xl overflow-hidden border border-gray-200 dark:border-white/5 bg-white dark:bg-[#161b22] hover:border-gray-300 dark:hover:border-white/10 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all cursor-pointer block"
                    >
                        <div className="aspect-video w-full bg-gray-100 dark:bg-zinc-800 relative">
                            {board.backgroundImage && (
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${board.backgroundImage})` }}
                                />
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <span className="bg-white text-zinc-900 px-3 py-1.5 rounded-lg font-semibold text-xs shadow-lg">Open Board</span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{board.title}</h3>
                                <MoreHorizontal className="w-4 h-4 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 shrink-0" />
                            </div>
                            <p className="text-xs text-gray-400 dark:text-zinc-500 mb-4 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> Updated recently
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex -space-x-2">
                                    <div className="h-6 w-6 rounded-full border-2 border-white dark:border-[#161b22] bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-[9px] font-medium text-gray-600 dark:text-zinc-300">
                                        {board.title.charAt(0)}
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-200 dark:ring-emerald-500/20">Active</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Create Board Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New Board</h3>
                        <form onSubmit={handleCreateBoard}>
                            <input
                                type="text"
                                value={newBoardTitle}
                                onChange={(e) => setNewBoardTitle(e.target.value)}
                                placeholder="Board Title"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors font-semibold"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
