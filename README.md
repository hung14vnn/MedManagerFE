# MedManager Frontend

A comprehensive medical management system built with React, TypeScript, Vite, and shadcn/ui.

## Features

### User Interface
- **Drug Search**: Search and view detailed drug information
- **Interaction Checker**: Check for drug-drug interactions
- **Disease Treatment**: View evidence-based treatment protocols

### Admin Interface
- **Manage Drugs**: Add, edit, and delete drug entries
- **Manage Interactions**: Create and manage drug interaction data
- **Manage Diseases**: Configure treatment protocols for diseases

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Axios** - HTTP client
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `https://localhost:5001`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://localhost:5001
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navbar.tsx
│   ├── DrugSearchInput.tsx
│   ├── DrugDetailCard.tsx
│   └── SeverityBadge.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── DrugSearchPage.tsx
│   ├── InteractionCheckerPage.tsx
│   ├── DiseaseTreatmentPage.tsx
│   └── admin/          # Admin pages
│       ├── AdminDashboard.tsx
│       ├── ManageDrugsPage.tsx
│       ├── ManageInteractionsPage.tsx
│       └── ManageDiseasesPage.tsx
├── lib/                # Utilities and API clients
│   ├── api.ts          # API functions
│   ├── api-client.ts   # Axios configuration
│   ├── helpers.ts      # Helper functions
│   └── utils.ts        # General utilities
├── types/              # TypeScript types
│   └── api.ts          # API DTOs
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Features Overview

### Drug Search
- Real-time search with debouncing
- Detailed drug information with tabbed interface
- Indications, dosage, precautions, and references

### Interaction Checker
- Add multiple medications
- Check for pairwise interactions
- Severity indicators (Mild, Moderate, Severe)
- Management recommendations

### Disease Treatment
- Browse diseases
- View preferred and alternative treatments
- Dosage recommendations and special conditions

### Admin Features
- Full CRUD operations for drugs
- Create drug interaction entries
- Add disease treatment protocols
- Manage disease information

## API Integration

The frontend communicates with the MedManager API:

- Base URL: `https://localhost:5001`
- All API calls are typed using TypeScript interfaces
- React Query manages caching and state

## Available Routes

### User Routes
- `/` - Home page
- `/drug-search` - Drug search interface
- `/interaction-checker` - Drug interaction checker
- `/disease-treatment` - Disease treatment protocols

### Admin Routes
- `/admin` - Admin dashboard
- `/admin/drugs` - Manage drugs
- `/admin/interactions` - Manage interactions
- `/admin/diseases` - Manage diseases

## Development

```bash
# Run development server
npm run dev

# Type check
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT
