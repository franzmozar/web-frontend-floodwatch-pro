# NAC FloodWatch Pro

A modern, responsive flood monitoring and early warning system for urban areas. FloodWatch Pro allows real-time tracking of flood sensors, user statuses, and emergency notifications.

![FloodWatch Pro Dashboard](docs/dashboard-preview.png)

## Features

- **Real-time flood monitoring** - Track flood sensors across multiple locations
- **User management** - Monitor user statuses and emergency situations
- **Dark/Light mode** - Full theme support with optimized UI for both modes
- **Responsive design** - Optimized for desktop, tablet, and mobile devices
- **Modern UI components** - Reusable components built with React, TypeScript and TailwindCSS

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: TailwindCSS
- **Icons**: Heroicons (@heroicons/react)
- **Authentication**: Custom auth flow with OTP verification

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js (v16 or later)
- npm (v7 or later)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/franzmozar/web-frontend-floodwatch-pro.git
cd web-frontend-floodwatch-pro
```

2. Install dependencies:

```bash
npm install
```

> **Note**: Due to dependency version conflicts, you may need to use the `--force` flag:
>
> ```bash
> npm install --force
> ```

3. Create a `.env` file in the root directory with the following content:

```
VITE_API_URL=http://localhost:3000/api
```

## Development

To start the development server:

```bash
npm run dev
```

This will start the application on [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── auth/           # Authentication components
│   └── ui/             # UI components (Badge, Card, DataTable, etc.)
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state management
│   └── ThemeContext.tsx # Theme (dark/light) management
├── hooks/              # Custom React hooks
├── layouts/            # Page layouts
├── pages/              # Application pages
│   ├── DashboardPage.tsx
│   ├── FloodWatchPage.tsx
│   ├── LoginPage.tsx
│   └── UsersPage.tsx
└── App.tsx             # Main application component
```

## Key Components

### UI Components

- **Badge**: Customizable status badges with variants (success, danger, warning, info)
- **Card**: Reusable card component with customizable shadows and styles
- **DataTable**: Advanced data table with support for custom cell rendering and badge integration
- **StatCard**: Statistical cards with trend indicators
- **FloodWatchMap**: Map visualization for flood sensor locations

### Auth Flow

The application implements a two-step authentication process:

1. Username/password login
2. OTP verification

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Surigao National Agricultural Center (NAC) for the initiative
- All contributors and stakeholders involved in the development

## Backend Configuration

This project uses a custom backend API service to manage flood monitoring data. The backend API is designed to handle authentication, data storage, and real-time alerts.

### API Service Setup

The application connects to the backend API using custom services:

- `api.service.ts` - Base API service for making HTTP requests with authentication
- `floodwatch-api.service.ts` - Specific API service for FloodWatch functionality
- `test-api.service.ts` - Test utilities for generating sample data

### Environment Configuration

Create a `.env` file based on the provided `.env.example`:

```
# API Configuration
VITE_API_URL=http://localhost:8000/api
VITE_AUTH_KEY=auth-token

# Environment
NODE_ENV=development
```

Replace `VITE_API_URL` with your actual backend API URL.

### Authentication

The API uses token-based authentication. The token is stored in localStorage and sent with each request in the Authorization header:

```
Authorization: Bearer <token>
```

### Test Data Generation

For development and testing, you can use the TestDataGenerator component to create sample flood data:

1. Single records with custom values
2. Batch generation of random flood data records
3. Reset test data

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Building for Production

```bash
npm run build
```

## Project Structure

- `/src/components` - React components
- `/src/contexts` - React context providers
- `/src/hooks` - Custom React hooks
- `/src/services` - API services
- `/src/utils` - Utility functions
