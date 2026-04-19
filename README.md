# n3n Web Management Tool

A comprehensive web management tool for n3n, built with React, shadcn/ui, and Vite.

## Project Structure

```
n3n-web-mgmt/
├── src/
│   ├── pages/          # Page components
│   │   ├── HomePage.tsx       # Main landing page
│   │   ├── EdgesPage.tsx      # Network edges table page
│   │   ├── SupernodesPage.tsx # Supernodes table page
│   │   └── StatsPage.tsx      # Network statistics page
│   ├── routes/         # Router configuration
│   │   └── index.tsx          # Main router setup
│   ├── components/     # React components
│   │   ├── ui/                # shadcn/ui components
│   │   └── theme-provider.tsx
│   ├── lib/            # Utility functions
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Client entry point
│   └── index.css       # Global styles
├── vite.config.ts      # Vite configuration
├── package.json        # Project dependencies
└── README.md           # This file
```

## Features

- **Multi-page application** with React Router
- **shadcn/ui components** for modern UI
- **Network edges table** with real-time data
- **Supernodes table** with real-time data
- **Network statistics** with charts and metrics
- **Responsive design** using Tailwind CSS
- **Error handling** with sonner toast notifications

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- n3n daemon running with management socket

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Run the development server:

```bash
pnpm run dev
```

### Build for Production

Build the application:

```bash
pnpm run build
```

The application will be available at http://localhost:5173 (development) or http://localhost:4173 (preview)

## Pages

- **Home Page**: Introduction to the n3n Web Management tool with navigation links
- **Edges Page**: Table displaying network edge nodes with real-time data
- **Supernodes Page**: Table displaying supernodes with real-time data
- **Stats Page**: Network statistics with charts and metrics

## API Integration

The application connects to the n3n management API through the following endpoints:

- `/api/edges` - Get network edge nodes
- `/api/supernodes` - Get supernodes
- `/api/info` - Get daemon information
- `/api/timestamps` - Get recent activity timestamps
- `/api/packetstats` - Get packet statistics

## Error Handling

The application uses sonner toast notifications for error handling, providing a user-friendly way to display error messages when API requests fail.

## Future Enhancements

- Implement authentication
- Add real-time updates using WebSockets
- Add more configuration options
- Improve performance with code splitting
- Add dark mode support