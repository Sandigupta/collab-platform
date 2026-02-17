import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import type { Column, Task } from '../../types';
import { TaskCard } from '../task/TaskCard';
import { MoreHorizontal, Plus, X } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';

import { useBoardStore } from '../../store/boardStore';

interface BoardColumnProps {
    column: Column;
    tasks: Task[];
    onTaskClick?: (task: Task) => void;
}

export const BoardColumn = ({ column, tasks, onTaskClick }: BoardColumnProps) => {
    const { createTask } = useTaskStore();
    const { updateColumn } = useBoardStore();
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(column.title);

    const handleSaveTitle = async () => {
        if (title.trim() !== column.title) {
            await updateColumn(column.id, title);
        }
        setIsEditingTitle(false);
    };

    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return;
        await createTask(column.id, newTaskTitle);
        setNewTaskTitle('');
        setIsAddingTask(false);
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-gray-100 dark:bg-gray-800/50 w-80 h-[500px] max-h-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 opacity-60 shrink-0"
            ></div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex flex-col w-80 shrink-0 bg-[#ebebed] dark:bg-[#161b22] rounded-xl p-3 max-h-full transition-colors"
        >
            <div
                {...attributes}
                {...listeners}
                className="flex items-center justify-between mb-4 px-1 cursor-grab"
            >
                <div className="flex items-center gap-2 flex-1 mr-2">
                    {isEditingTitle ? (
                        <input
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleSaveTitle}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveTitle();
                                if (e.key === 'Escape') {
                                    setTitle(column.title);
                                    setIsEditingTitle(false);
                                }
                            }}
                            className="font-bold text-[#121117] dark:text-white text-sm uppercase tracking-wider bg-white dark:bg-gray-700 px-1 py-0.5 rounded border border-indigo-600 focus:outline-none w-full"
                        />
                    ) : (
                        <h3
                            onClick={() => setIsEditingTitle(true)}
                            className="font-bold text-[#121117] dark:text-white text-sm uppercase tracking-wider cursor-pointer hover:bg-white/50 dark:hover:bg-gray-700/50 px-1 py-0.5 rounded transition-colors"
                        >
                            {column.title}
                        </h3>
                    )}
                    <span className="bg-[#dcdce5] dark:bg-gray-700 text-[#656487] dark:text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shrink-0">
                        {tasks.length}
                    </span>
                </div>
                <button className="text-[#656487] hover:text-[#121117] dark:hover:text-white transition-colors p-1 rounded hover:bg-white/50 shrink-0">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col flex-1 gap-3 overflow-y-auto custom-scrollbar pr-1 min-h-[50px]">
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                    ))}
                </SortableContext>
            </div>

            {isAddingTask ? (
                <div className="mt-3 p-1">
                    <textarea
                        autoFocus
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Enter title..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddTask();
                            } else if (e.key === 'Escape') {
                                setIsAddingTask(false);
                            }
                        }}
                        className="w-full p-3 rounded-lg bg-white dark:bg-gray-900 border-2 border-indigo-600 text-sm text-[#121117] dark:text-white placeholder-gray-400 focus:outline-none resize-none shadow-sm"
                        rows={3}
                    />
                    <div className="flex items-center gap-2 mt-2">
                        <button
                            onClick={handleAddTask}
                            className="px-3 py-1.5 bg-[#5048e5] text-white rounded text-sm font-medium hover:bg-opacity-90 transition-colors"
                        >
                            Add
                        </button>
                        <button
                            onClick={() => setIsAddingTask(false)}
                            className="p-1.5 text-[#656487] hover:text-[#121117] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsAddingTask(true)}
                    className="mt-4 flex items-center justify-center gap-2 py-2 text-[#656487] hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Task</span>
                </button>
            )}
        </div>
    );
};
