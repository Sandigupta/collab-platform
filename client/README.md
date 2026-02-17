# Real-Time Task Collaboration Platform (Frontend)

This is the frontend implementation of a Real-Time Task Collaboration Platform built with React, TypeScript, and Vite. It serves as a proof-of-concept for a collaborative project management tool similar to Trello or Jira.

## Features

- **Authentication**: JWT-based authentication flow (simulated with mock API). Includes Login and Signup pages.
- **Dashboard**: View and manage multiple project boards. Create new boards with custom titles.
- **Board View**: 
  - Drag-and-drop interface for tasks and columns using `@dnd-kit`.
  - Create, edit, and delete tasks.
  - Create and delete columns.
  - Real-time updates (simulated with optimistic UI updates).
- **Task Management**:
  - Detailed task view with title, description, and assignees.
  - Assign users to tasks.
  - Activity logging for task creation and movement.
- **Activity Log**: View recent activities on the board in a dedicated side panel.
- **Responsive Design**: Fully responsive layout optimized for desktop and tablet.

## Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Routing**: [React Router](https://reactrouter.com/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: `clsx`, `tailwind-merge`, `date-fns`

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd collab-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── board/          # Board-specific components (Column, ActivityPanel)
│   ├── layout/         # Layout components (DashboardLayout)
│   ├── task/           # Task-specific components (TaskCard, TaskEditModal)
│   └── ui/             # Generic UI components
├── lib/                # Utility functions
├── pages/              # Application pages (Login, Dashboard, Board)
├── services/           # API services (Mock API implementation)
├── store/              # State management (Zustand stores)
├── types/              # TypeScript type definitions
└── App.tsx             # Main application entry point
```

## Mock API

The application strictly uses a mock API layer (`src/services/mockApi.ts`) to simulate backend interactions. Data is stored in-memory and persists only for the duration of the session (page reload resets data, except for checking localStorage for auth token simulation).

## License

MIT
