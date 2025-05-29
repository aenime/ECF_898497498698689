import mongoose from 'mongoose';

// Track connection readiness state
export const db = {
  isConnected: false,
};

/**
 * Returns the current database connection state
 */
export function getConnectionState(): string {
  const states = [
    'disconnected',
    'connected',
    'connecting',
    'disconnecting',
  ];
  
  return states[mongoose.connection.readyState] || 'unknown';
}

/**
 * Returns basic database statistics for monitoring
 */
export async function getDatabaseStats() {
  if (!db.isConnected) {
    throw new Error('Database not connected');
  }
  
  try {
    const stats = {
      connection: getConnectionState(),
      collections: {} as Record<string, number>,
    };
    
    // Get collection counts
    const collections = Object.keys(mongoose.connection.models);
    
    for (const collection of collections) {
      const model = mongoose.connection.models[collection];
      stats.collections[collection] = await model.countDocuments();
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting database stats:', error);
    throw error;
  }
}

/**
 * Close the database connection
 */
export async function closeDbConnection() {
  try {
    await mongoose.disconnect();
    db.isConnected = false;
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
}

// Graceful shutdown handling
if (process.env.NODE_ENV !== 'development') {
  process.on('SIGINT', async () => {
    try {
      await closeDbConnection();
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  });
  
  process.on('SIGTERM', async () => {
    try {
      await closeDbConnection();
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  });
}
