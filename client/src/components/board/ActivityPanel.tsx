import { useEffect } from 'react';
import { useActivityStore } from '../../store/activityStore';
import { History, X, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityPanelProps {
    boardId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const ActivityPanel = ({ boardId, isOpen, onClose }: ActivityPanelProps) => {
    const { activities, fetchActivities, hasMore, loadMoreActivities, isLoading } = useActivityStore();

    useEffect(() => {
        if (isOpen && boardId) {
            fetchActivities(boardId);
        }
    }, [isOpen, boardId, fetchActivities]);

    return (
        <div
            className={`fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="h-full flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-bold text-gray-900 dark:text-white">Activity</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {activities.length === 0 ? (
                            <div className="text-center py-12">
                                <History className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Actions on this board will appear here</p>
                            </div>
                        ) : (
                            activities.map((activity) => (
                                <div key={activity.id} className="flex gap-3 group">
                                    <div className="mt-0.5 shrink-0">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${activity.type === 'comment' || activity.type === 'COMMENT'
                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                            }`}>
                                            {activity.type === 'comment' || activity.type === 'COMMENT'
                                                ? <MessageSquare className="w-3.5 h-3.5" />
                                                : (activity.user?.name?.charAt(0)?.toUpperCase() || 'U')
                                            }
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            <span className="font-semibold">{activity.user?.name || 'User'}</span>{' '}
                                            {activity.action}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}

                        {hasMore && (
                            <button
                                onClick={() => loadMoreActivities(boardId)}
                                disabled={isLoading}
                                className="w-full py-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Loading...' : 'Load More'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
