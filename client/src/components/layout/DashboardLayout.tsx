import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

import {
    LayoutGrid,
    Clock,
    Users,
    Settings,
    LogOut
} from 'lucide-react';

export const DashboardLayout = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <div className="flex h-screen overflow-hidden bg-[#f6f6f8] dark:bg-[#0f1117] text-gray-900 dark:text-white antialiased font-display">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-[#121121] text-white flex flex-col transition-all duration-300">
                {/* Brand */}
                <div className="h-20 flex items-center px-6">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5048e5] text-white shadow-lg shadow-indigo-500/20">
                            <LayoutGrid className="h-5 w-5" strokeWidth={2} />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white">CollabFlow</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                    <div className="space-y-1">
                        <Link
                            to="/dashboard"
                            className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${isActive('/dashboard') && !location.pathname.includes('/board/')
                                ? 'bg-[#1e1d2b] text-white border-l-4 border-[#5048e5]'
                                : 'text-[#656487] hover:bg-[#1e1d2b] hover:text-white'
                                }`}
                        >
                            <LayoutGrid className="h-5 w-5" />
                            Active Board
                        </Link>

                        <a href="#" className="group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#656487] hover:bg-[#1e1d2b] hover:text-white transition-all">
                            <Clock className="h-5 w-5" />
                            Recent
                        </a>

                        <a href="#" className="group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#656487] hover:bg-[#1e1d2b] hover:text-white transition-all">
                            <Users className="h-5 w-5" />
                            Team Members
                        </a>
                    </div>

                    {/* Settings Section */}
                    <div>
                        <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-[#4a495e] mb-3">Settings</h3>
                        <div className="space-y-1">
                            <a href="#" className="group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#656487] hover:bg-[#1e1d2b] hover:text-white transition-all">
                                <Settings className="h-5 w-5" />
                                Preferences
                            </a>
                        </div>
                    </div>
                </nav>

                {/* Footer: Logout & Credits */}
                <div className="p-6 border-t border-[#1e1d2b]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-sm font-medium text-[#656487] hover:text-white transition-colors mb-6"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>


                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#f6f6f8] dark:bg-[#0f1117] overflow-hidden transition-colors duration-200">
                <div className="h-full overflow-y-auto px-6 py-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
