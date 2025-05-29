import mongoose from 'mongoose';

/**
 * Checks if the provided ID is a valid MongoDB ObjectId
 */
export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Handles MongoDB validation errors and returns user-friendly error messages
 */
export function handleMongooseValidationError(error: any): { field: string; message: string }[] {
  if (error.name !== 'ValidationError') {
    return [{ field: 'general', message: error.message || 'Database error' }];
  }
  
  const errors: { field: string; message: string }[] = [];
  
  for (const field in error.errors) {
    errors.push({
      field,
      message: error.errors[field].message
    });
  }
  
  return errors;
}

/**
 * Handles MongoDB duplicate key errors and returns user-friendly error messages
 */
export function handleMongooseDuplicateKeyError(error: any): { field: string; message: string } {
  // Extract the key field from the error
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  
  return {
    field,
    message: `${field} '${value}' already exists`
  };
}

/**
 * Generic error handler for MongoDB errors
 */
export function handleMongooseError(error: any): { 
  status: number; 
  errors: { field: string; message: string }[] 
} {
  // Validation errors (e.g., required fields)
  if (error.name === 'ValidationError') {
    return {
      status: 400,
      errors: handleMongooseValidationError(error)
    };
  }
  
  // Duplicate key errors
  if (error.code === 11000) {
    return {
      status: 400,
      errors: [handleMongooseDuplicateKeyError(error)]
    };
  }
  
  // Cast errors (e.g., invalid ObjectId)
  if (error.name === 'CastError') {
    return {
      status: 400,
      errors: [{ 
        field: error.path || 'id', 
        message: `Invalid ${error.path || 'id'} format` 
      }]
    };
  }
  
  // Generic error handling
  return {
    status: 500,
    errors: [{ field: 'general', message: error.message || 'Internal server error' }]
  };
}

/**
 * Creates pagination data for API responses
 */
export function getPaginationData(
  totalItems: number,
  currentPage: number = 1,
  pageSize: number = 20
): {
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const totalPages = Math.ceil(totalItems / pageSize);
  
  return {
    total: totalItems,
    currentPage,
    pageSize,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
}
