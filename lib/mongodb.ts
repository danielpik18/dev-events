import mongoose, { Mongoose } from 'mongoose';

/**
 * Global type for caching MongoDB connection in Node.js global scope
 * Prevents TypeScript errors when accessing global.mongooseCache
 */
declare global {
  var mongooseCache: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

/**
 * MongoDB Connection URI
 * Uses MONGODB_URI environment variable, defaults to local MongoDB instance
 */
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextjs-dev-events';

/**
 * Validates that MONGODB_URI is set in development
 */
if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
  throw new Error('MONGODB_URI environment variable is not defined');
}

/**
 * Initialize the global cache object if it doesn't exist
 */
let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = {
    conn: null,
    promise: null,
  };
}

/**
 * Establishes a cached MongoDB connection using Mongoose
 *
 * This function prevents multiple connections to MongoDB during development
 * by caching the connection promise. On server restarts, if a connection
 * is already established, it reuses that connection.
 *
 * @returns Promise<Mongoose> - A promise that resolves to the Mongoose instance
 * @throws Error if connection fails
 */
async function connectToDatabase(): Promise<Mongoose> {
  /**
   * Return existing connection if already established
   * This handles the case where the function is called multiple times
   * and a connection is already active
   */
  if (cached.conn) {
    return cached.conn;
  }

  /**
   * If a connection promise exists but is still pending, wait for it
   * This prevents race conditions where multiple requests try to connect simultaneously
   */
  if (cached.promise) {
    cached.conn = await cached.promise;
    return cached.conn;
  }

  /**
   * Create a new connection promise if neither exists
   * This promise will be cached for subsequent calls
   */
  const promise = mongoose
    .connect(MONGODB_URI, {
      /**
       * Connection options for Mongoose
       * These settings ensure stable, efficient connections
       */
      bufferCommands: false,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })
    .then((mongooseInstance) => {
      console.log('✓ Successfully connected to MongoDB');
      return mongooseInstance;
    })
    .catch((error: Error) => {
      console.error('✗ Failed to connect to MongoDB:', error.message);
      throw error;
    });

  cached.promise = promise;
  cached.conn = await promise;

  return cached.conn;
}

export default connectToDatabase;
