# CollabFlow - Real-Time Collaboration Platform

<img width="1920" height="3982" alt="Image" src="https://github.com/user-attachments/assets/622d41a1-2e67-4620-b277-aeaceba0b5cf" />


## Overview

CollabFlow is a robust, full-stack task collaboration platform designed to facilitate seamless teamwork through real-time updates and intuitive task management. Built with a modern tech stack, it features a responsive drag-and-drop interface, instant state synchronization across clients, and a secure, scalable backend.

This project demonstrates a clear separation of concerns with a dedicated frontend client and a RESTful API backend, orchestrated to work in harmony. It incorporates advanced patterns such as Optimistic UI updates for a lag-free user experience and comprehensive activity logging for accountability.

## Architecture

CollabFlow follows a modern Client-Server architecture, ensuring scalability, maintainability, and security.

```text
+-------------------------------------------------------+
|                   Client (Frontend)                   |
|                                                       |
|   +----------------+       +----------------------+   |
|   |   React UI     | <---> |    Zustand Store     |   |
|   +-------+--------+       +----------+-----------+   |
|           |                           |               |
|           |                           |               |
|           v                           v               |
|   +-------+--------+       +----------+-----------+   |
|   |  Axios (HTTP)  |       |   Socket.io Client   |   |
|   +-------+--------+       +----------+-----------+   |
+-----------|---------------------------^---------------+
            |                           |
            | REST API                  | Real-time Events
            | (Request/Response)        | (Bi-directional)
            |                           |
+-----------|---------------------------v---------------+
|           v                +----------+-----------+   |
|   +-------+--------+       |   Socket.io Server   |   |
|   |   Express API  |       +----------+-----------+   |
|   +-------+--------+                  |               |
|           |                           |               |
|           v                           v               |
|   +-------+--------+       +----------+-----------+   |
|   |   Middleware   |       |   Event Handlers     |   |
|   +-------+--------+       +----------+-----------+   |
|           |                           |               |
|           v                           v               |
|   +-------+---------------------------+-----------+   |
|   |              Prisma ORM (Data Layer)          |   |
|   +---------------------------+-------------------+   |
+-------------------------------|-----------------------+
                                |
                                | SQL Queries
                                v
                    +-----------------------+
                    |  PostgreSQL Database  |
                    +-----------------------+
```

### 1. Client-Side (Frontend)
The frontend is a Single Page Application (SPA) built with **React 19** and **Vite**. It handles all user interactions and state management locally to provide a responsive experience.
-   **State Management**: Utilizes **Zustand** for global state management. Stores are split into logical units (Auth, Board, Task, Socket, user) to maintain clean separation of concerns.
-   **Real-Time Synchronization**: Connects to the backend via **Socket.io-client**. It listens for events like `task:moved` or `comment:added` and updates the local store immediately, ensuring all connected users see the same state without refreshing.
-   **Optimistic UI**: For actions like moving a task or editing a description, the UI updates the local state immediately before waiting for the server response. If the server request fails, the state is reverted, providing a perceived zero-latency experience.

### 2. Server-Side (Backend)
The backend is a RESTful API built with **Node.js** and **Express**, coupled with a **Socket.io** server for real-time bidirectional communication.
-   **API Layer**: Handles standard HTTP requests for authentication, data retrieval, and persistence.
-   **WebSocket Layer**: Manages real-time events. When a user performs an action, the server broadcasts the event to all other clients subscribed to the specific board room.
-   **Database Access**: Uses **Prisma ORM** to interact with the **PostgreSQL** database. Prisma provides type-safe database queries and automated migrations.

### 3. Database
The data persistence layer is handled by **PostgreSQL**. The schema includes relational models for:
-   **Users**: Storage for user credentials and profile information.
-   **Boards**: The top-level container for tasks.
-   **Columns**: Grouping mechanism for tasks within a board.
-   **Tasks**: Individual items with properties like priority, due date, and description.
-   **Activities**: A log of all actions performed within the system for audit and history tracking.

## Key Features

-   **Real-Time Collaboration**: Powered by **Socket.io**, all board actions (task moves, edits, comments) are instantly reflected across all connected clients.
-   **Drag-and-Drop Task Management**: Utilize **@dnd-kit** for a smooth, accessible drag-and-drop experience to organize tasks across columns.
-   **Optimistic UI Updates**: The interface updates instantly upon user action, syncing with the server in the background to ensure a responsive feel.
-   **Activity History Logging**: Detailed tracking of all actions within a board, including task creation, updates, movement, and member assignments.
-   **Board Member Management**: Invite and manage members with specific permissions.
-   **Secure Authentication**: Robust JWT-based authentication with secure password hashing using **BCryptJS**.
-   **Responsive Design**: A mobile-first approach using **Tailwind CSS** ensures the application looks great on all devices.

## Tech Stack

### Client (Frontend)
-   **Framework**: React 19 with Vite for highly optimized build performance.
-   **State Management**: Zustand for efficient, hook-based state management.
-   **Styling**: Tailwind CSS for a utility-first, responsive design system.
-   **Drag & Drop**: @dnd-kit for accessible and performant drag-and-drop interactions.
-   **Real-Time**: Socket.io-client for websocket connections.
-   **Networking**: Axios for promise-based HTTP requests.
-   **Icons**: Lucide React for a consistent and lightweight icon set.

### Server (Backend)
-   **Runtime**: Node.js & Express.
-   **Database**: PostgreSQL using Prisma ORM.
-   **Real-Time**: Socket.io for websocket server implementation.
-   **Validation**: Zod for strict runtime schema validation of incoming data.
-   **Authentication**: JSON Web Tokens (JWT) & BCryptJS for secure stateless authentication.
-   **Testing**: Jest & Supertest for unit and integration testing.

## Prerequisites

Before you begin, ensure you have the following installed:
-   Node.js (v16 or higher recommended)
-   npm or yarn
-   PostgreSQL (running locally or a cloud instance)

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd collab-platform
    ```

2.  **Install Dependencies:**
    
    *Root (optional, if using workspaces):*
    ```bash
    npm install
    ```

    *Server:*
    ```bash
    cd server
    npm install
    ```

    *Client:*
    ```bash
    cd ../client
    npm install
    ```

## Environment Variables

You need to configure environment variables for both the server and client.

### Server Configuration
Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Connection (Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/collabflow?schema=public"

# Authentication
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Client Configuration
Create a `.env` file in the `client` directory (or use `.env.local`):

```env
# API URL (Point to your server address)
VITE_API_URL=http://localhost:4000
```

## Running the Application

### 1. Database Setup (Server)
Ensure your PostgreSQL database is running, then apply migrations:

```bash
cd server
npm run db:migrate
npm run db:generate
```

### 2. Start the Backend Server
In the `server` directory:

```bash
# Development mode (with auto-reload)
npm run dev
```
The server will start on `http://localhost:4000`.

### 3. Start the Frontend Client
In the `client` directory:

```bash
# Development server
npm run dev
```
The client will start on `http://localhost:5173`.

## Running Tests

The backend includes a comprehensive test suite using Jest.

```bash
cd server
npm test
```

## Project Structure

```
collab-platform/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Feature-specific logic
│   │   ├── pages/          # Application pages (Routing)
│   │   ├── services/       # API and Service calls
│   │   ├── store/          # Zustand state stores
│   │   ├── App.tsx         # Main App component
│   │   └── main.tsx        # Entry point
│   ├── .env                # Client environment variables
│   └── package.json
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── config/         # Configuration (DB, Env)
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware (Auth, Validation)
│   │   ├── routes/         # API Route definitions
│   │   ├── services/       # Business logic
│   │   ├── sockets/        # Socket.io event handlers
│   │   ├── utils/          # Utility functions
│   │   ├── app.ts          # App setup
│   │   └── server.ts       # Server entry point
│   ├── prisma/             # Database schema and migrations
│   ├── .env                # Server environment variables
│   └── package.json
│
└── docs/                   # Documentation and Guides
```

## Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

Distributed under the MIT License. See `LICENSE` for more information.
