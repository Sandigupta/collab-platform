import { useState, useEffect, useRef, useMemo } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useBoardStore } from '../../store/boardStore';
import { useActivityStore } from '../../store/activityStore';
import { useAuthStore } from '../../store/authStore';
import type { Task } from '../../types';

interface TaskDetailModalProps {
    task: Task;
    onClose: () => void;
}

export const TaskDetailModal = ({ task, onClose }: TaskDetailModalProps) => {
    const { updateTask, deleteTask, addChecklistItem, toggleChecklistItem, assignUser, unassignUser } = useTaskStore();
    const { columns } = useBoardStore();
    const { activities, logActivity } = useActivityStore();
    const { user } = useAuthStore();

    const [title, setTitle] = useState(task.title);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [description, setDescription] = useState(task.description || '');
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [comment, setComment] = useState('');
    const [newChecklistTitle, setNewChecklistTitle] = useState('');
    const [showMemberMenu, setShowMemberMenu] = useState(false);

    // Real board members from API
    const { currentBoard } = useBoardStore();
    const availableUsers = (currentBoard?.boardMembers || [])
        .map(m => m.user)
        .filter((u): u is { id: string; name: string; email: string; avatar?: string | null } => !!u);

    const descTextareaRef = useRef<HTMLTextAreaElement>(null);

    // Sync state with task prop
    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description || '');
    }, [task]);

    // Auto-resize textarea
    useEffect(() => {
        if (isEditingDesc && descTextareaRef.current) {
            descTextareaRef.current.style.height = 'auto';
            descTextareaRef.current.style.height = descTextareaRef.current.scrollHeight + 'px';
        }
    }, [isEditingDesc, description]);

    const handleSaveTitle = async () => {
        if (title.trim() !== task.title) {
            await updateTask(task.id, { title });
            if (user) {
                logActivity(task.columnId, user.id, `renamed task to "${title}"`, 'history', task.id);
            }
        }
        setIsEditingTitle(false);
    };

    const handleSaveDescription = async () => {
        if (description !== task.description) {
            await updateTask(task.id, { description });
            if (user) {
                logActivity(task.columnId, user.id, `updated description`, 'history', task.id);
            }
        }
        setIsEditingDesc(false);
    };

    const handleAddChecklistItem = async () => {
        if (!newChecklistTitle.trim()) return;
        await addChecklistItem(task.id, newChecklistTitle);
        setNewChecklistTitle('');
        if (user) {
            logActivity(task.columnId, user.id, `added checklist item`, 'history', task.id);
        }
    };

    const handleSendComment = async () => {
        if (!comment.trim() || !user) return;
        await logActivity(task.columnId, user.id, comment, 'comment', task.id);
        setComment('');
    };

    const handleDeleteTask = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            await deleteTask(task.id);
            onClose();
        }
    };

    const columnTitle = useMemo(() => {
        return columns.find(c => c.id === task.columnId)?.title || 'Unknown';
    }, [task.columnId, columns]);

    const checklistProgress = task.checklists && task.checklists.length > 0
        ? Math.round((task.checklists.filter(i => i.completed).length / task.checklists.length) * 100)
        : 0;

    const filteredActivities = activities
        .filter(a => a.taskId === task.id || a.type === 'history')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Newest first

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Side Panel / Drawer */}
            <div className="w-full max-w-4xl bg-white dark:bg-slate-900 h-screen shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 relative animate-in slide-in-from-right duration-300">

                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        {/* Task Completion Status - Placeholder/Checkbox */}
                        <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer ${task.completed ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-600 hover:border-green-500'}`}
                            onClick={async () => {
                                await updateTask(task.id, { completed: !task.completed });
                            }}
                        >
                            {task.completed && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                        </div>

                        {isEditingTitle ? (
                            <input
                                autoFocus
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleSaveTitle}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                                className="text-xl font-bold tracking-tight bg-transparent border-b border-primary focus:outline-none w-full text-slate-900 dark:text-slate-100"
                            />
                        ) : (
                            <h1
                                onClick={() => setIsEditingTitle(true)}
                                className={`text-xl font-bold tracking-tight truncate cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 px-2 -ml-2 rounded transition-colors text-slate-900 dark:text-slate-100 ${task.completed ? 'line-through opacity-50' : ''}`}
                            >
                                {task.title}
                            </h1>
                        )}
                        <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 shrink-0">
                            {columnTitle}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-slate-500">share</span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined text-slate-500">more_horiz</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined text-slate-500 hover:text-red-600 dark:text-slate-400">close</span>
                        </button>
                    </div>
                </header>

                {/* Main Layout: Two Columns */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Column: Content (Scrollable) */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                        {/* Meta Controls Row - "Debugging" Style */}
                        <div className="flex flex-wrap gap-2 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Add
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">label</span>
                                Labels
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">schedule</span>
                                Dates
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">check_box</span>
                                Checklist
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowMemberMenu(!showMemberMenu)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                    Members
                                </button>
                                {showMemberMenu && (
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-in fade-in zoom-in-50 duration-200 p-2">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase px-2 mb-2">Assign Members</h4>
                                        <div className="space-y-1">
                                            {availableUsers.map(u => {
                                                const isAssigned = task.assignedUsers?.includes(u.id);
                                                return (
                                                    <button
                                                        key={u.id}
                                                        onClick={() => {
                                                            if (isAssigned) {
                                                                unassignUser(task.id, u.id);
                                                            } else {
                                                                assignUser(task.id, u.id);
                                                            }
                                                        }}
                                                        className={`w-full flex items-center gap-2 p-2 rounded-md text-sm transition-colors ${isAssigned ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                                                            {u.name.charAt(0)}
                                                        </div>
                                                        <span className="flex-1 text-left">{u.name}</span>
                                                        {isAssigned && <span className="material-symbols-outlined text-[16px]">check</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description Section */}
                        <section className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                                    <span className="material-symbols-outlined text-lg">subject</span>
                                    <h2>Description</h2>
                                </div>
                                {!isEditingDesc && (
                                    <button
                                        onClick={() => setIsEditingDesc(true)}
                                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {isEditingDesc ? (
                                <div className="space-y-2 animate-in fade-in duration-200">
                                    <textarea
                                        ref={descTextareaRef}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full p-4 rounded-lg bg-white dark:bg-slate-800 border-2 border-indigo-600 text-sm text-slate-900 dark:text-slate-100 focus:outline-none resize-none min-h-[120px]"
                                        placeholder="Add a detailed description..."
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveDescription}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDescription(task.description || '');
                                                setIsEditingDesc(false);
                                            }}
                                            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-sm font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap pl-7"
                                >
                                    {description || 'No description provided.'}
                                </div>
                            )}
                        </section>

                        {/* Checklist Section */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                                    <span className="material-symbols-outlined text-lg">checklist</span>
                                    <h2>Checklist</h2>
                                </div>
                                <span className="text-xs font-bold text-slate-500">{checklistProgress}%</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                                    style={{ width: `${checklistProgress}%` }}
                                ></div>
                            </div>

                            <div className="space-y-2">
                                {task.checklists && task.checklists.map(item => (
                                    <div key={item.id} className="flex items-center gap-3 group">
                                        <input
                                            type="checkbox"
                                            checked={item.completed}
                                            onChange={() => toggleChecklistItem(task.id, item.id)}
                                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-600 border-slate-300 dark:border-slate-600 dark:bg-slate-800 cursor-pointer"
                                        />
                                        <span className={`text-sm ${item.completed ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {item.title}
                                        </span>
                                    </div>
                                ))}

                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        className="text-sm text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 hover:underline disabled:opacity-50"
                                        disabled={newChecklistTitle.length > 0}
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                    </button>
                                    <input
                                        type="text"
                                        value={newChecklistTitle}
                                        onChange={(e) => setNewChecklistTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                                        placeholder="Add an item..."
                                        className="bg-transparent border-none focus:ring-0 text-sm w-full p-0 text-slate-700 dark:text-slate-300 placeholder-slate-400"
                                    />
                                    {newChecklistTitle && (
                                        <button
                                            onClick={handleAddChecklistItem}
                                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase px-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded"
                                        >
                                            Add
                                        </button>
                                    )}
                                </div>
                            </div>
                        </section>

                        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={handleDeleteTask}
                                className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">delete</span>
                                Delete Task
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Activity Feed (Scrollable) */}
                    <aside className="w-80 border-l border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col shrink-0">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                <span className="material-symbols-outlined text-lg">chat_bubble</span>
                                Comments and activity
                            </h2>
                            <button className="px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                                Hide details
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                            {filteredActivities.map(activity => (
                                <div key={activity.id} className="flex gap-3 relative group">
                                    <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-200 dark:bg-slate-800 group-last:hidden"></div>
                                    <div className="w-8 h-8 rounded-full bg-[#047857] flex items-center justify-center text-white text-xs font-bold shrink-0 z-10 border-2 border-white dark:border-slate-900">
                                        {activity.userId.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <p className="text-slate-700 dark:text-slate-300">
                                            <span className="font-bold">User {activity.userId}</span>
                                            {activity.type === 'comment' ? ' commented:' : ` ${activity.action}`}
                                        </p>
                                        {activity.type === 'comment' && (
                                            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 mt-1 shadow-sm text-slate-600 dark:text-slate-400">
                                                "{activity.action}"
                                            </div>
                                        )}
                                        <p className="text-slate-400">
                                            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sticky Footer: Comment Input */}
                        <footer className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                            <div className="flex gap-3 items-start w-full">
                                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 relative">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-900 transition-all text-sm resize-none pr-12 text-slate-900 dark:text-white placeholder-slate-500"
                                        placeholder="Write a comment..."
                                        rows={1}
                                    ></textarea>
                                    <div className="absolute right-2 bottom-1.5 flex items-center gap-1">
                                        <button
                                            onClick={handleSendComment}
                                            className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50"
                                            disabled={!comment.trim()}
                                        >
                                            <span className="material-symbols-outlined text-lg">send</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </aside>
                </div>
            </div>
        </div>
    );
};
