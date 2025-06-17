const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE_PATH = path.join(__dirname, 'data', 'inventory.json');

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Helper function to read data
const readInventoryData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { items: [], categories: [], suppliers: [], activityLog: [] };
  }
};

// Helper function to write data
const writeInventoryData = async (data) => {
  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
};

// Helper function to log activity
const logActivity = async (action, itemId, details) => {
  const data = await readInventoryData();
  const timestamp = new Date().toISOString();
  
  data.activityLog.unshift({
    id: uuidv4(),
    action,
    itemId,
    details,
    timestamp
  });
  
  // Keep log to a reasonable size
  if (data.activityLog.length > 100) {
    data.activityLog = data.activityLog.slice(0, 100);
  }
  
  await writeInventoryData(data);
};

// CRUD API Routes

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const data = await readInventoryData();
    res.json(data.items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Server error fetching items' });
  }
});

// Get a single item by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const data = await readInventoryData();
    const item = data.items.find(item => item.id === req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Server error fetching item' });
  }
});

// Create new item
app.post('/api/items', async (req, res) => {
  try {
    const data = await readInventoryData();
    const newItem = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.items.push(newItem);
    
    if (await writeInventoryData(data)) {
      await logActivity('create', newItem.id, `Created item: ${newItem.name}`);
      res.status(201).json(newItem);
    } else {
      res.status(500).json({ error: 'Error saving the item' });
    }
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Server error creating item' });
  }
});

// Update an item
app.put('/api/items/:id', async (req, res) => {
  try {
    const data = await readInventoryData();
    const index = data.items.findIndex(item => item.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const updatedItem = {
      ...data.items[index],
      ...req.body,
      id: req.params.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    data.items[index] = updatedItem;
    
    if (await writeInventoryData(data)) {
      await logActivity('update', updatedItem.id, `Updated item: ${updatedItem.name}`);
      res.json(updatedItem);
    } else {
      res.status(500).json({ error: 'Error updating the item' });
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Server error updating item' });
  }
});

// Delete an item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const data = await readInventoryData();
    const index = data.items.findIndex(item => item.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const deletedItem = data.items[index];
    
    // Remove the item from the array
    data.items.splice(index, 1);
    
    if (await writeInventoryData(data)) {
      await logActivity('delete', deletedItem.id, `Deleted item: ${deletedItem.name}`);
      res.json({ message: 'Item deleted successfully', item: deletedItem });
    } else {
      res.status(500).json({ error: 'Error deleting the item' });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Server error deleting item' });
  }
});

// Archive an item instead of permanent deletion
app.put('/api/items/:id/archive', async (req, res) => {
  try {
    const data = await readInventoryData();
    const index = data.items.findIndex(item => item.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Mark item as archived
    data.items[index].archived = true;
    data.items[index].updatedAt = new Date().toISOString();
    
    if (await writeInventoryData(data)) {
      await logActivity('archive', data.items[index].id, `Archived item: ${data.items[index].name}`);
      res.json(data.items[index]);
    } else {
      res.status(500).json({ error: 'Error archiving the item' });
    }
  } catch (error) {
    console.error('Error archiving item:', error);
    res.status(500).json({ error: 'Server error archiving item' });
  }
});

// Bulk update items
app.patch('/api/items/bulk', async (req, res) => {
  try {
    const { itemIds, updates } = req.body;
    
    if (!Array.isArray(itemIds) || itemIds.length === 0 || !updates) {
      return res.status(400).json({ error: 'Invalid request format' });
    }
    
    const data = await readInventoryData();
    let updatedCount = 0;
    
    data.items = data.items.map(item => {
      if (itemIds.includes(item.id)) {
        updatedCount++;
        return {
          ...item,
          ...updates,
          id: item.id, // Ensure ID doesn't change
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });
    
    if (await writeInventoryData(data)) {
      await logActivity('bulk-update', 'multiple', `Bulk updated ${updatedCount} items`);
      res.json({ message: `${updatedCount} items updated successfully` });
    } else {
      res.status(500).json({ error: 'Error during bulk update' });
    }
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({ error: 'Server error processing bulk update' });
  }
});

// Get dashboard data
app.get('/api/dashboard', async (req, res) => {
  try {
    const data = await readInventoryData();
    
    // Calculate summary statistics
    const totalItems = data.items.length;
    const lowStockItems = data.items.filter(item => item.quantity <= item.minStockThreshold).length;
    const outOfStockItems = data.items.filter(item => item.quantity === 0).length;
    
    // Get recent activity
    const recentActivity = data.activityLog.slice(0, 10);
    
    // Return dashboard data
    res.json({
      summary: {
        totalItems,
        lowStockItems,
        outOfStockItems
      },
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
});

// Get categories and suppliers
app.get('/api/metadata', async (req, res) => {
  try {
    const data = await readInventoryData();
    res.json({
      categories: data.categories,
      suppliers: data.suppliers
    });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({ error: 'Server error fetching metadata' });
  }
});

// Import/Export functionality
app.post('/api/import', async (req, res) => {
  try {
    const importData = req.body;
    
    if (!Array.isArray(importData)) {
      return res.status(400).json({ error: 'Import data must be an array of items' });
    }
    
    const data = await readInventoryData();
    
    // Add each import item, generating new IDs
    const newItems = importData.map(item => ({
      id: uuidv4(),
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    data.items = [...data.items, ...newItems];
    
    if (await writeInventoryData(data)) {
      await logActivity('import', 'multiple', `Imported ${newItems.length} items`);
      res.status(201).json({ message: `${newItems.length} items imported successfully` });
    } else {
      res.status(500).json({ error: 'Error importing items' });
    }
  } catch (error) {
    console.error('Error importing items:', error);
    res.status(500).json({ error: 'Server error importing items' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
