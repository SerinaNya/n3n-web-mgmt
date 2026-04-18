# n3n Web Management Tool

A comprehensive web management tool for n3n, built with React, shadcn/ui, and Vite SSR.

## Project Structure

```
n3n-web-mgmt/
├── src/
│   ├── pages/          # Page components
│   │   ├── HomePage.tsx   # Main landing page
│   │   └── EdgesPage.tsx  # Network edges table page
│   ├── routes/         # Router configuration
│   │   └── index.tsx      # Main router setup
│   ├── components/     # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── theme-provider.tsx
│   ├── lib/            # Utility functions
│   ├── entry-ssr.tsx   # SSR entry point
│   ├── App.tsx         # Main App component
│   ├── main.tsx        # Client entry point
│   └── index.css       # Global styles
├── server.ts           # Express server for SSR
├── vite.config.ts      # Vite configuration
├── package.json        # Project dependencies
└── README.md           # This file
```

## Features

- **Multi-page application** with React Router
- **Server-Side Rendering (SSR)** using Vite
- **shadcn/ui components** for modern UI
- **Network edges table** with mock data
- **Responsive design** using Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager

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

### Run SSR Server

Start the SSR server:

```bash
node server.ts
```

The application will be available at http://localhost:3000

## Pages

- **Home Page**: Introduction to the n3n Web Management tool
- **Edges Page**: Table displaying network edge nodes with mock data

## Mock Data

The Edges page currently uses mock data since the actual JSON-RPC endpoint is not yet connected. The mock data simulates the response from the following curl command:

```bash
curl --unix-socket /run/n3n/test/mgmt http://x/v1 -d '{"jsonrpc": "2.0", "method": "get_edges", "id": 1}'
```

## Future Enhancements

- Connect to actual JSON-RPC endpoint
- Add more pages for network configuration
- Implement authentication
- Add real-time updates
- Improve error handling