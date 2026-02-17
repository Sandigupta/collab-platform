import { useState } from 'react';
import type { Task } from '../../types';
import { useTaskStore } from '../../store/taskStore';
import { useBoardStore } from '../../store/boardStore';
import { useAuthStore } from '../../store/authStore';
import { X, Trash2, Save } from 'lucide-react';

interface TaskEditModalProps {
    task: Task;
    onClose: () => void;
}

export const TaskEditModal = ({ task, onClose }: TaskEditModalProps) => {
    const { updateTask, deleteTask, assignUser, unassignUser } = useTaskStore();
    const { currentBoard } = useBoardStore();
    const { user } = useAuthStore();
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');

    const boardMembers = currentBoard?.boardMembers || [];

    const handleSave = async () => {
        await updateTask(task.id, { title, description });
        onClose();
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this task?')) {
            await deleteTask(task.id);
            onClose();
        }
    };

    const handleAssignSelf = async () => {
        if (user && !task.assignedUsers.includes(user.id)) {
            await assignUser(task.id, user.id);
        }
    };

    const handleUnassign = async (userId: string) => {
        await unassignUser(task.id, userId);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Task Details</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDelete}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Task"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-lg font-bold border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                placeholder="Add a more detailed description..."
                                className="w-full text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Assignees
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <div
                                    onClick={handleAssignSelf}
                                    className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 dark:border-indigo-500/30 cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-500/30 transition-colors"
                                    title="Assign yourself"
                                >
                                    +
                                </div>
                                {task.assignedUsers.map(uid => {
                                    const member = boardMembers.find(m => m.user?.id === uid);
                                    const name = member?.user?.name || '?';
                                    return (
                                        <div
                                            key={uid}
                                            onClick={() => handleUnassign(uid)}
                                            className={`h-8 w-8 rounded-full ${getAvatarColor(uid)} text-white flex items-center justify-center text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity`}
                                            title={`${name} (click to unassign)`}
                                        >
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Click + to assign yourself, click an avatar to unassign.</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
