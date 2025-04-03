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
git clone https://github.com/your-username/nac-floodwatch-pro.git
cd nac-floodwatch-pro
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
