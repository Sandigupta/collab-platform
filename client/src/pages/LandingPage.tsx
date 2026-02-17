import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import {
    LayoutGrid,
    ChevronRight,
    Play,
    Lock,
    Inbox,
    CheckCircle2,
    KanbanSquare,
    Plus,
    Paperclip,
    MessageSquare,
    RefreshCw,
    LayoutDashboard,
    BarChart2,
    Globe,
    Share2,
    Mail
} from 'lucide-react';

export const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="antialiased bg-white dark:bg-gray-950 text-zinc-600 dark:text-zinc-400 selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-700 dark:selection:text-indigo-300 min-h-screen transition-colors duration-200" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-100 dark:border-white/5 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white transition-transform group-hover:scale-105">
                            <LayoutGrid className="h-5 w-5" strokeWidth={1.5} />
                        </div>
                        <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">CollabFlow</span>
                    </Link>

                    <div className="hidden items-center gap-8 md:flex">
                        <a href="#" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">Product</a>
                        <a href="#" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">Solutions</a>
                        <a href="#" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">Pricing</a>
                        <a href="#" className="text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white">Resources</a>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link to="/login" className="hidden text-sm font-medium text-zinc-600 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white sm:block">
                            Log in
                        </Link>
                        <Link to="/signup" className="rounded-full bg-zinc-900 dark:bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-zinc-800 dark:hover:bg-indigo-500 hover:shadow-lg hover:shadow-zinc-500/20 dark:hover:shadow-indigo-500/20">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
                {/* Background decorative gradients */}
                <div className="pointer-events-none absolute -top-24 -left-20 h-[500px] w-[500px] rounded-full bg-indigo-50 dark:bg-indigo-950/50 blur-3xl opacity-50" />
                <div className="pointer-events-none absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-purple-50 dark:bg-purple-950/50 blur-3xl opacity-50" />

                <div className="mx-auto max-w-7xl px-6 text-center relative z-10">


                    {/* Headline */}
                    <h1 className="mx-auto max-w-4xl text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white md:text-6xl lg:text-7xl">
                        Work Together, <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            Anywhere in the world.
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-xl">
                        Experience seamless real-time collaboration that keeps your team synchronized. The ultimate platform for modern, fast-moving teams to ship faster.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            to="/signup"
                            className="group flex h-12 items-center gap-2 rounded-full bg-indigo-600 px-8 text-base font-medium text-white transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
                        >
                            Start Free Trial
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
                        </Link>
                        <button className="group flex h-12 items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-8 text-base font-medium text-zinc-600 dark:text-zinc-300 transition-all hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white active:scale-95">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-700">
                                <Play className="ml-0.5 h-3 w-3 text-zinc-900 dark:text-white fill-zinc-900 dark:fill-white" strokeWidth={1.5} />
                            </div>
                            Watch Demo
                        </button>
                    </div>

                    {/* Dashboard Preview (CSS Art Mockup) */}
                    <div className="relative mt-20 mx-auto max-w-5xl">
                        {/* Glow behind image */}
                        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-xl" />

                        <div className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xl ring-1 ring-zinc-900/5 dark:ring-white/5">
                            {/* Window Controls */}
                            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 px-4 py-3">
                                <div className="flex gap-1.5">
                                    <div className="h-3 w-3 rounded-full bg-red-400/80" />
                                    <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                                    <div className="h-3 w-3 rounded-full bg-green-400/80" />
                                </div>
                                <div className="mx-auto flex w-1/3 items-center justify-center gap-2 rounded-md bg-white dark:bg-zinc-800 py-1 shadow-sm border border-zinc-200/50 dark:border-zinc-700">
                                    <Lock className="h-3 w-3 text-zinc-400" strokeWidth={1.5} />
                                    <span className="text-xs text-zinc-400">collabflow.com/dashboard</span>
                                </div>
                            </div>

                            {/* App Interface Mockup — always dark for visual consistency */}
                            <div className="flex h-[400px] md:h-[500px] bg-zinc-900 text-white">
                                {/* Sidebar */}
                                <div className="hidden w-64 flex-col border-r border-white/10 bg-zinc-900 p-4 md:flex">
                                    <div className="mb-6 flex items-center gap-2 opacity-80">
                                        <div className="h-6 w-6 rounded bg-indigo-500" />
                                        <span className="text-sm font-medium">Acme Corp</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3 rounded-md bg-white/10 px-3 py-2 text-sm text-white">
                                            <Inbox className="h-4 w-4 text-zinc-400" /> Inbox
                                        </div>
                                        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                                            <CheckCircle2 className="h-4 w-4" /> My Tasks
                                        </div>
                                        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                                            <KanbanSquare className="h-4 w-4" /> Boards
                                        </div>
                                    </div>
                                    <div className="mt-8 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Projects</div>
                                    <div className="mt-2 space-y-1">
                                        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 transition-colors">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Website Redesign
                                        </div>
                                        <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 transition-colors">
                                            <span className="h-2 w-2 rounded-full bg-blue-500" /> Mobile App
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 overflow-hidden bg-zinc-800/50 p-6">
                                    <div className="mb-8 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-medium text-white">Website Redesign</h3>
                                            <p className="mt-1 text-sm text-zinc-400">Q3 Marketing Initiative</p>
                                        </div>
                                        <div className="flex -space-x-2">
                                            <img src="https://ui-avatars.com/api/?name=Alex&background=6366f1&color=fff" className="h-8 w-8 rounded-full border-2 border-zinc-900" alt="Alex" />
                                            <img src="https://ui-avatars.com/api/?name=Sarah&background=ec4899&color=fff" className="h-8 w-8 rounded-full border-2 border-zinc-900" alt="Sarah" />
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-zinc-900 bg-zinc-700 text-xs text-zinc-300">+3</div>
                                        </div>
                                    </div>

                                    {/* Kanban Columns */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                        {/* To Do */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm text-zinc-400">
                                                <span>To Do</span>
                                                <Plus className="h-4 w-4 cursor-pointer hover:text-white" />
                                            </div>
                                            <div className="group relative rounded-lg border border-white/5 bg-zinc-800 p-4 shadow-sm transition-all hover:border-white/10 hover:shadow-md cursor-grab">
                                                <div className="mb-2 flex gap-2">
                                                    <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400">Design</span>
                                                </div>
                                                <p className="text-sm font-medium text-zinc-200">Create new style guide</p>
                                                <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                                                    <Paperclip className="h-3.5 w-3.5 text-zinc-500" />
                                                    <span className="text-xs text-zinc-500">Oct 24</span>
                                                </div>
                                            </div>
                                            <div className="rounded-lg border border-white/5 bg-zinc-800 p-4 opacity-60">
                                                <div className="h-2 w-1/3 rounded bg-zinc-700 mb-2" />
                                                <div className="h-4 w-3/4 rounded bg-zinc-700" />
                                            </div>
                                        </div>

                                        {/* In Progress */}
                                        <div className="hidden md:block space-y-3">
                                            <div className="flex items-center justify-between text-sm text-zinc-400">
                                                <span>In Progress</span>
                                                <Plus className="h-4 w-4 cursor-pointer hover:text-white" />
                                            </div>
                                            <div className="rounded-lg border border-indigo-500/30 bg-zinc-800 p-4 shadow-sm ring-1 ring-indigo-500/20">
                                                <div className="mb-2 flex gap-2">
                                                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">Dev</span>
                                                </div>
                                                <p className="text-sm font-medium text-zinc-200">Implement authentication flow</p>
                                                <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                                                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                                                        <MessageSquare className="h-3.5 w-3.5" /> 3
                                                    </div>
                                                    <img src="https://ui-avatars.com/api/?name=Mike&background=10b981&color=fff" className="h-5 w-5 rounded-full" alt="Mike" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Done */}
                                        <div className="hidden md:block space-y-3">
                                            <div className="flex items-center justify-between text-sm text-zinc-400">
                                                <span>Done</span>
                                                <Plus className="h-4 w-4 cursor-pointer hover:text-white" />
                                            </div>
                                            <div className="rounded-lg border border-white/5 bg-zinc-800 p-4 opacity-50">
                                                <div className="mb-2 w-12 h-4 rounded bg-zinc-700" />
                                                <div className="h-4 w-full rounded bg-zinc-700 mb-2" />
                                                <div className="h-4 w-1/2 rounded bg-zinc-700" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="border-y border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02] py-12">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <p className="mb-8 text-xs font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">Trusted by 500+ forward-thinking teams worldwide</p>
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-60 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
                        <svg className="h-8" viewBox="0 0 100 30" fill="currentColor">
                            <path d="M10,15 L20,5 L30,15 L20,25 Z M40,5 H90 V25 H40 Z" fill="#52525b" />
                        </svg>
                        <svg className="h-7" viewBox="0 0 100 30" fill="currentColor">
                            <circle cx="15" cy="15" r="10" fill="#52525b" />
                            <rect x="35" y="8" width="55" height="14" fill="#52525b" />
                        </svg>
                        <svg className="h-8" viewBox="0 0 100 30" fill="currentColor">
                            <rect x="5" y="5" width="20" height="20" rx="5" fill="#52525b" />
                            <rect x="35" y="8" width="55" height="14" fill="#52525b" />
                        </svg>
                        <svg className="h-6" viewBox="0 0 100 30" fill="currentColor">
                            <path d="M10,25 L20,5 L30,25 M40,5 H90 V25 H40 Z" stroke="#52525b" strokeWidth="4" fill="none" />
                        </svg>
                        <svg className="h-7" viewBox="0 0 100 30" fill="currentColor">
                            <circle cx="15" cy="15" r="8" stroke="#52525b" strokeWidth="3" fill="none" />
                            <circle cx="28" cy="15" r="8" fill="#52525b" />
                            <rect x="45" y="8" width="45" height="14" fill="#52525b" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* Capabilities / Features */}
            <section id="features" className="py-24 md:py-32">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mb-16 md:text-center">
                        <span className="text-xs font-semibold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">Capabilities</span>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white md:text-5xl">Streamline Your Workflow</h2>
                        <p className="mt-6 max-w-2xl text-lg text-zinc-500 dark:text-zinc-400 md:mx-auto md:text-xl">
                            Everything you need to manage projects and collaborate in one place. Built for speed, designed for efficiency, and scaled for growth.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {/* Card 1 */}
                        <div className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-black/30 hover:border-indigo-100 dark:hover:border-indigo-500/20">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                <RefreshCw className="h-6 w-6" strokeWidth={1.5} />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">Real-time Sync</h3>
                            <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                Instant updates across all devices so your team stays on the same page. No more refreshing or manual saves needed.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-black/30 hover:border-indigo-100 dark:hover:border-indigo-500/20">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                                <LayoutDashboard className="h-6 w-6" strokeWidth={1.5} />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">Boards &amp; Lists</h3>
                            <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                Organize tasks visually with flexible Kanban boards and customizable lists. Drag and drop your way to project success.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-black/30 hover:border-indigo-100 dark:hover:border-indigo-500/20">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                <BarChart2 className="h-6 w-6" strokeWidth={1.5} />
                            </div>
                            <h3 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-white">Activity Tracking</h3>
                            <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                Keep a clear audit trail of all changes and monitor project progress with detailed history logs and advanced analytics.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 px-6 py-20 text-center shadow-2xl md:px-12 md:py-24">
                        {/* Abstract Shapes */}
                        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-indigo-500 opacity-20 blur-3xl mix-blend-screen" />
                        <div className="absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-purple-500 opacity-30 blur-3xl mix-blend-screen" />

                        <div className="relative z-10 mx-auto max-w-3xl">
                            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                                Ready to transform your team?
                            </h2>
                            <p className="mt-6 text-lg text-indigo-100 md:text-xl leading-relaxed">
                                Join thousands of teams already using CollabFlow to ship faster and work better together. Start your 14-day free trial today.
                            </p>
                            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-indigo-900 shadow-lg shadow-indigo-900/20 transition-transform hover:scale-105 hover:bg-indigo-50 active:scale-95"
                                >
                                    Start Free Trial
                                </button>
                                <button className="rounded-full border border-indigo-400/30 bg-indigo-800/50 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-indigo-800 hover:border-indigo-400/50">
                                    Talk to Sales
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-100 dark:border-white/5 bg-white dark:bg-gray-950 pt-20 pb-12">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                        <div className="col-span-2 lg:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600 text-white">
                                    <LayoutGrid className="h-3.5 w-3.5" strokeWidth={2} />
                                </div>
                                <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">CollabFlow</span>
                            </div>
                            <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                                The world's leading collaboration platform for modern remote and hybrid teams.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Product</h4>
                            <ul className="mt-4 space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Enterprise</a></li>
                                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Solutions</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Company</h4>
                            <ul className="mt-4 space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Press</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Legal</h4>
                            <ul className="mt-4 space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-zinc-100 dark:border-white/5 pt-8 sm:flex-row">
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">© 2024 CollabFlow Inc. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Globe className="h-5 w-5" strokeWidth={1.5} /></a>
                            <a href="#" className="text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Share2 className="h-5 w-5" strokeWidth={1.5} /></a>
                            <a href="#" className="text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Mail className="h-5 w-5" strokeWidth={1.5} /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
