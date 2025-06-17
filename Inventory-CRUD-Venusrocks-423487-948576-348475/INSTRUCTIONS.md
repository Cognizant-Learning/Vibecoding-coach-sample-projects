# Running the Inventory Management Dashboard

## Quick Start

To run both the backend and frontend together:

```
node start-dev.js
```

## Manual Start

### Start the Backend

```powershell
cd backend
npm run dev
```

The backend server will start at http://localhost:5000

### Start the Frontend

```powershell
cd frontend
npm start
```

The frontend application will open in your default browser at http://localhost:3000

## Available Features

1. **Dashboard** - Summary statistics, visual charts, and recent activity
2. **Inventory** - Full CRUD management for all inventory items
   - View all items with search and filtering
   - Create new items
   - Update existing items
   - Delete or archive items
   - Bulk operations
3. **Import/Export** - Import or export inventory data in CSV format

## Testing the API

You can test the backend API directly using tools like Postman or curl:

### Example API Endpoints:

- GET http://localhost:5000/api/items - List all items
- GET http://localhost:5000/api/items/:id - Get a specific item
- POST http://localhost:5000/api/items - Create a new item
- PUT http://localhost:5000/api/items/:id - Update an item
- DELETE http://localhost:5000/api/items/:id - Delete an item
- GET http://localhost:5000/api/dashboard - Get dashboard statistics
