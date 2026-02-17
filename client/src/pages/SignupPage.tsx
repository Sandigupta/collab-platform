import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutGrid } from 'lucide-react';

export const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signup, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await signup(name, email, password);
        if (useAuthStore.getState().user) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
            <div className="max-w-md w-full space-y-8">
                {/* Brand */}
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                            <LayoutGrid className="h-6 w-6" strokeWidth={2} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">CollabFlow</span>
                    </Link>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-zinc-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                            Sign in
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-lg shadow-sm -space-y-px overflow-hidden">
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Full name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 placeholder-gray-400 dark:placeholder-zinc-500 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="signup-email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="signup-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 placeholder-gray-400 dark:placeholder-zinc-500 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="signup-password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="signup-password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength={6}
                                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 placeholder-gray-400 dark:placeholder-zinc-500 text-gray-900 dark:text-white bg-white dark:bg-zinc-900 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-colors"
                                placeholder="Password (min 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 dark:text-red-400 text-sm text-center">{error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-950 disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
