import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types';
import { Trash2 } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { useBoardStore } from '../../store/boardStore';

interface TaskCardProps {
    task: Task;
    onClick?: (task: Task) => void;
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
    const { currentBoard } = useBoardStore();
    const boardMembers = currentBoard?.boardMembers || [];

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 h-[100px] w-full rotate-3"
            />
        );
    }

    // Function to get distinct colors for tags based on content
    const getTagColor = (label: string) => {
        const colors = {
            'Design': 'bg-[#5048e5]/10 text-[#5048e5]',
            'Backend': 'bg-orange-100 text-orange-700',
            'Frontend': 'bg-blue-100 text-blue-700',
            'Management': 'bg-purple-100 text-purple-700',
        };
        return colors[label as keyof typeof colors] || 'bg-gray-100 text-gray-700';
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
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => !isDragging && onClick?.(task)}
            className="bg-white dark:bg-[#1e1d2b] p-4 rounded-lg shadow-sm border border-[#dcdce5] dark:border-gray-700 hover:border-[#5048e5]/50 transition-all cursor-pointer group relative"
        >
            {/* Hover Action */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this task?')) {
                            const { deleteTask } = useTaskStore.getState();
                            deleteTask(task.id);
                        }
                    }}
                    className="text-[#656487] hover:text-red-600 p-1 hover:bg-gray-100 rounded transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
                {task.labels?.map(label => (
                    <span key={label} className={`${getTagColor(label)} text-[10px] font-bold px-2 py-0.5 rounded uppercase`}>
                        {label}
                    </span>
                ))}
            </div>

            <h4 className={`text-[#121117] dark:text-white font-semibold text-sm mb-3 leading-tight ${task.completed ? 'opacity-50 line-through' : ''}`}>
                {task.title}
            </h4>

            {task.description && (
                <p className="text-xs text-[#656487] mb-3 line-clamp-2">
                    {task.description}
                </p>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center text-[#656487] gap-1">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    <span className="text-[11px] font-medium">Oct 12</span> {/* Placeholder date logic */}
                </div>

                {task.assignedUsers && task.assignedUsers.length > 0 && (
                    <div className="flex -space-x-1.5">
                        {task.assignedUsers.map((uid) => {
                            const member = boardMembers.find(m => m.user?.id === uid);
                            const name = member?.user?.name || '?';
                            return (
                                <div
                                    key={uid}
                                    title={name}
                                    className={`w-6 h-6 rounded-full ${getAvatarColor(uid)} text-white border border-white dark:border-[#1e1d2b] flex items-center justify-center text-[10px] font-bold`}
                                >
                                    {name.charAt(0).toUpperCase()}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
