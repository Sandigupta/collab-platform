import { useState } from 'react';
import { useBoardStore } from '../../store/boardStore';
import { useAuthStore } from '../../store/authStore';
import { X, UserPlus, Crown, Trash2 } from 'lucide-react';

interface BoardMembersPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BoardMembersPanel = ({ isOpen, onClose }: BoardMembersPanelProps) => {
    const { currentBoard, addMember, removeMember } = useBoardStore();
    const { user } = useAuthStore();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState('');

    if (!isOpen || !currentBoard) return null;

    const boardMembers = currentBoard.boardMembers || [];
    const isOwner = currentBoard.ownerId === user?.id;

    const handleInvite = async () => {
        if (!email.trim()) return;
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            await addMember(currentBoard.id, email.trim());
            setSuccess(`Successfully added ${email} to the board!`);
            setEmail('');
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to add member';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemove = async (userId: string, name: string) => {
        if (!window.confirm(`Remove ${name} from this board? They will also be unassigned from all tasks.`)) return;
        try {
            await removeMember(currentBoard.id, userId);
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to remove member';
            setError(message);
        }
    };

    // Generate a consistent color for each user avatar
    const getAvatarColor = (userId: string) => {
        const colors = [
            'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
            'bg-cyan-500', 'bg-purple-500', 'bg-teal-500', 'bg-orange-500',
        ];
        let hash = 0;
        for (let i = 0; i < userId.length; i++) hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            {/* Panel */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">Board Members</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                {/* Invite Form (Owner Only) */}
                {isOwner && (
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">
                            Invite by Email
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); setSuccess(''); }}
                                onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                                placeholder="user@example.com"
                                className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                            />
                            <button
                                onClick={handleInvite}
                                disabled={isSubmitting || !email.trim()}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                            >
                                {isSubmitting ? '...' : 'Add'}
                            </button>
                        </div>
                        {error && (
                            <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
                        )}
                        {success && (
                            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">{success}</p>
                        )}
                    </div>
                )}

                {/* Members List */}
                <div className="px-6 py-4 max-h-[300px] overflow-y-auto">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        {boardMembers.length} Member{boardMembers.length !== 1 ? 's' : ''}
                    </p>
                    <div className="space-y-2">
                        {boardMembers.map((member) => {
                            const u = member.user;
                            if (!u) return null;
                            const isMemberOwner = currentBoard.ownerId === u.id;
                            return (
                                <div
                                    key={u.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                >
                                    <div className={`w-8 h-8 rounded-full ${getAvatarColor(u.id)} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{u.name}</p>
                                            {isMemberOwner && (
                                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                                                    <Crown className="w-2.5 h-2.5" />
                                                    Owner
                                                </span>
                                            )}
                                            {u.id === user?.id && !isMemberOwner && (
                                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded-full">
                                                    You
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.email}</p>
                                    </div>
                                    {/* Remove button (owner only, can't remove owner) */}
                                    {isOwner && !isMemberOwner && (
                                        <button
                                            onClick={() => handleRemove(u.id, u.name)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                            title="Remove member"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
