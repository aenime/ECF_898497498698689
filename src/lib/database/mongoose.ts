// Forward compatibility file for mongoose connection
import dbConnect, { connectToDatabase } from './connection';

export { connectToDatabase };
export default dbConnect;
