# Inventory Management Dashboard

A fully-featured CRUD application for managing inventory, built with Node.js and React.

## Project Overview

This application provides a user-friendly web interface where users can track, update, and manage stock items, view inventory levels, and ensure operational efficiency.

## Features

- **Dashboard** with summary statistics, visual representations, and recent activity log
- **CRUD Operations** for inventory items:
  - Create new items with detailed information
  - View all items with search, filter, and sort capabilities
  - Update existing items individually or in bulk
  - Delete or archive items
- **Integration Capabilities** including import/export functionality and barcode scanning support

## Tech Stack

### Backend
- Node.js with Express
- JSON file-based storage for data persistence
- RESTful API design

### Frontend
- React
- Material UI for modern, responsive design
- Chart.js for data visualization
- React Router for navigation
- Formik for form handling

## Project Structure

```
inventory-dashboard/
├── backend/                  # Node.js backend
│   ├── data/                 # Data storage folder
│   │   └── inventory.json    # JSON database file
│   ├── index.js              # Main server file
│   └── package.json          # Backend dependencies
├── frontend/                 # React frontend
│   ├── public/               # Static assets
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React context providers
│   │   ├── pages/            # Application pages
│   │   ├── services/         # API services
│   │   └── utils/            # Utility functions
│   └── package.json          # Frontend dependencies
├── start-dev.js              # Development script to run both apps
└── requirements.md           # Project requirements
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd inventory-dashboard
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

#### Development Mode

To run both backend and frontend simultaneously:

```
node start-dev.js
```

Or start each separately:

**Backend:**
```
cd backend
npm run dev
```

**Frontend:**
```
cd frontend
npm start
```

The frontend application will be available at `http://localhost:3000` and the backend API at `http://localhost:5000`.

#### Production Build

To create a production build of the frontend:

```
cd frontend
npm run build
```

## Usage

1. **Dashboard:** View summary statistics, inventory levels, and recent activities.
2. **Inventory:** Browse, search, and manage all inventory items.
3. **Add Item:** Create new inventory items with complete details.
4. **Import/Export:** Batch import or export inventory data.

## Project Timeline

- **Phase 1:** Design and database schema setup
- **Phase 2:** Core backend API and frontend UI development
- **Phase 3:** Testing, bug fixes, and deployment
