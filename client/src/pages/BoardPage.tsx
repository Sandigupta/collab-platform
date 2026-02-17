import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    DndContext,
    DragOverlay,
    type DragStartEvent,
    type DragEndEvent,
    type DragOverEvent,
    useSensor,
    useSensors,
    PointerSensor
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';

import { useBoardStore } from '../store/boardStore';
import { useTaskStore } from '../store/taskStore';
import { useAuthStore } from '../store/authStore';
import { useActivityStore } from '../store/activityStore';
import { useSocketStore } from '../store/socketStore';
import { BoardColumn } from '../components/board/BoardColumn';
import { TaskCard } from '../components/task/TaskCard';
import { BoardHeader } from '../components/board/BoardHeader';
import { TaskDetailModal } from '../components/task/TaskDetailModal';
import { ActivityPanel } from '../components/board/ActivityPanel';
import type { Column, Task } from '../types';
import { Plus, X } from 'lucide-react';

export const BoardPage = () => {
    const { boardId } = useParams<{ boardId: string }>();
    const { currentBoard, columns, fetchBoardData, createColumn, moveColumn } = useBoardStore();
    const { tasks, fetchTasks, moveTask, reorderTasks, addTaskLocal, updateTaskLocal, removeTaskLocal } = useTaskStore();
    const { connect, disconnect, joinBoard, leaveBoard, socket } = useSocketStore();
    const { user } = useAuthStore();
    const { logActivity } = useActivityStore();

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

    // Derived state: ensures modal always has latest task data (including optimistic updates)
    const editingTask = useMemo(() =>
        tasks.find(t => t.id === editingTaskId) || null
        , [tasks, editingTaskId]);

    const [isActivityPanelOpen, setIsActivityPanelOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState('');

    const handleAddColumn = async () => {
        if (!newColumnTitle.trim() || !boardId) return;
        await createColumn(boardId, newColumnTitle);
        setNewColumnTitle('');
        setIsAddingColumn(false);
    };

    // Socket Connection
    useEffect(() => {
        if (boardId) {
            connect();
            joinBoard(boardId);

            return () => {
                leaveBoard(boardId);
                disconnect();
            };
        }
    }, [boardId]);

    // Socket Event Listeners — use local-only methods (no API calls)
    useEffect(() => {
        if (!socket) return;

        const handleTaskCreated = (newTask: Task) => {
            addTaskLocal(newTask);
        };

        const handleTaskUpdated = (updatedTask: Task) => {
            updateTaskLocal(updatedTask.id, updatedTask);
        };

        const handleTaskMoved = (data: { taskId: string; task: Task }) => {
            updateTaskLocal(data.taskId, data.task);
        };

        const handleTaskDeleted = (data: { taskId: string }) => {
            removeTaskLocal(data.taskId);
        };

        const handleMemberAdded = (data: { member: any }) => {
            if (currentBoard) {
                const newMember = data.member;
                const currentBoardMembers = currentBoard.boardMembers || [];

                if (!currentBoardMembers.some(m => m.userId === newMember.userId)) {
                    const updatedBoardMembers = [...currentBoardMembers, newMember];
                    const updatedMemberIds = [...(currentBoard.members || []), newMember.userId];

                    useBoardStore.setState({
                        currentBoard: {
                            ...currentBoard,
                            boardMembers: updatedBoardMembers,
                            members: updatedMemberIds
                        }
                    });
                }
            }
        };

        const handleMemberRemoved = (data: { userId: string }) => {
            if (currentBoard) {
                const updatedBoardMembers = currentBoard.boardMembers?.filter(m => m.userId !== data.userId) || [];
                const updatedMemberIds = currentBoard.members?.filter(id => id !== data.userId) || [];

                useBoardStore.setState({
                    currentBoard: {
                        ...currentBoard,
                        boardMembers: updatedBoardMembers,
                        members: updatedMemberIds
                    }
                });
            }
        };

        const handleBoardDeleted = () => {
            // Navigate away from deleted board
            window.location.href = '/dashboard';
        };

        socket.on('task:created', handleTaskCreated);
        socket.on('task:updated', handleTaskUpdated);
        socket.on('task:moved', handleTaskMoved);
        socket.on('task:deleted', handleTaskDeleted);
        socket.on('board:member_added', handleMemberAdded);
        socket.on('board:member_removed', handleMemberRemoved);
        socket.on('board:deleted', handleBoardDeleted);

        return () => {
            socket.off('task:created', handleTaskCreated);
            socket.off('task:updated', handleTaskUpdated);
            socket.off('task:moved', handleTaskMoved);
            socket.off('task:deleted', handleTaskDeleted);
            socket.off('board:member_added', handleMemberAdded);
            socket.off('board:member_removed', handleMemberRemoved);
            socket.off('board:deleted', handleBoardDeleted);
        };
    }, [socket, currentBoard, addTaskLocal, updateTaskLocal, removeTaskLocal]);

    useEffect(() => {
        if (boardId) {
            fetchBoardData(boardId);
            fetchTasks(boardId);
        }
    }, [boardId]);

    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task);
            return;
        }
    };

    const getTasksForColumn = (columnId: string) => {
        return tasks.filter(task => {
            const matchesColumn = task.columnId === columnId;
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesColumn && matchesSearch;
        }).sort((a, b) => a.position - b.position);
    }

    const onDragEnd = (event: DragEndEvent) => {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveAColumn = active.data.current?.type === 'Column';
        if (isActiveAColumn) {
            moveColumn(activeId.toString(), overId.toString());
            return;
        }

        const isActiveATask = active.data.current?.type === 'Task';
        if (isActiveATask) {
            const activeTask = tasks.find(t => t.id === activeId);
            const overTask = tasks.find(t => t.id === overId);

            if (activeTask && overTask && activeTask.columnId === overTask.columnId) {
                const columnTasks = getTasksForColumn(activeTask.columnId);
                const activeIndex = columnTasks.findIndex(t => t.id === activeId);
                const overIndex = columnTasks.findIndex(t => t.id === overId);

                if (activeIndex !== overIndex) {
                    const newOrderIds = arrayMove(columnTasks, activeIndex, overIndex).map(t => t.id);
                    reorderTasks(activeTask.columnId, newOrderIds);
                }
            }
        }
    };

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === 'Task';
        const isOverATask = over.data.current?.type === 'Task';

        if (!isActiveATask) return;

        if (isActiveATask && isOverATask) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);

            if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                moveTask(activeId.toString(), tasks[overIndex].columnId, overIndex);
                if (user && boardId) logActivity(boardId, user.id, `moved task "${tasks[activeIndex].title}"`);
            }
        }

        const isOverAColumn = over.data.current?.type === 'Column';

        if (isActiveATask && isOverAColumn) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overTaskId = overId.toString();

            if (tasks[activeIndex].columnId !== overTaskId) {
                moveTask(activeId.toString(), overTaskId, activeIndex);
                if (user && boardId) logActivity(boardId, user.id, `moved task "${tasks[activeIndex].title}" to ${over.data.current?.column.title}`);
            }
        }
    };

    const handleTaskClick = (task: Task) => {
        setEditingTaskId(task.id);
    };

    if (!currentBoard) return (
        <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-[#0d1117]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#0d1117] overflow-hidden transition-colors duration-200">
            {/* ... (BoardHeader and drag/drop logic remain same) ... */}
            <BoardHeader
                title={currentBoard.title}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onToggleActivity={() => setIsActivityPanelOpen(!isActivityPanelOpen)}
            />

            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <DndContext
                    sensors={sensors}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragOver={onDragOver}
                >
                    <div className="flex gap-6 h-full items-start min-w-fit">
                        <SortableContext
                            items={columnsId}
                            strategy={horizontalListSortingStrategy}
                        >
                            {columns.map((column) => (
                                <BoardColumn
                                    key={column.id}
                                    column={column}
                                    tasks={getTasksForColumn(column.id)}
                                    onTaskClick={handleTaskClick}
                                />
                            ))}
                        </SortableContext>

                        {/* Add New Column */}
                        <div className="w-80 shrink-0">
                            {isAddingColumn ? (
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 animate-in fade-in duration-200">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newColumnTitle}
                                        onChange={(e) => setNewColumnTitle(e.target.value)}
                                        placeholder="Enter list name..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleAddColumn();
                                            if (e.key === 'Escape') setIsAddingColumn(false);
                                        }}
                                        className="w-full px-3 py-2 rounded border-2 border-indigo-600 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none mb-2"
                                    />
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handleAddColumn}
                                            className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                                        >
                                            Add list
                                        </button>
                                        <button
                                            onClick={() => setIsAddingColumn(false)}
                                            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAddingColumn(true)}
                                    className="w-full h-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-indigo-600 hover:text-indigo-600 transition-all cursor-pointer bg-white/30 dark:bg-gray-800/30 group"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    <span className="font-bold text-sm">Add New Column</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {createPortal(
                        <DragOverlay>
                            {activeColumn && (
                                <BoardColumn
                                    column={activeColumn}
                                    tasks={getTasksForColumn(activeColumn.id)}
                                />
                            )}
                            {activeTask && <TaskCard task={activeTask} />}
                        </DragOverlay>,
                        document.body
                    )}
                </DndContext>
            </div>

            {/* Task Detail Modal */}
            {editingTask && (
                <TaskDetailModal
                    task={editingTask}
                    onClose={() => setEditingTaskId(null)}
                />
            )}

            {/* Activity Panel */}
            <ActivityPanel
                boardId={currentBoard.id}
                isOpen={isActivityPanelOpen}
                onClose={() => setIsActivityPanelOpen(false)}
            />
        </div>
    );
};
