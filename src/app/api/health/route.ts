import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/database/connection';
import { getConnectionState } from '@/lib/database/state';
import mongoose from 'mongoose';
import os from 'os';

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Check database connection
    let dbStatus = 'unknown';
    let dbConnectTime = 0;
    let dbError = null;
    
    try {
      const dbStartTime = Date.now();
      await connectToDatabase();
      dbConnectTime = Date.now() - dbStartTime;
      dbStatus = getConnectionState();
    } catch (error: any) {
      dbError = error.message;
      dbStatus = 'error';
    }
    
    // Check system resources
    const systemInfo = {
      uptime: process.uptime(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        usage: process.memoryUsage(),
      },
      cpu: os.cpus(),
      platform: os.platform(),
      arch: os.arch(),
      loadAverage: os.loadavg(),
    };
    
    // Get model counts if DB is connected
    const collections = {};
    
    if (dbStatus === 'connected') {
      try {
        const modelNames = Object.keys(mongoose.models);
        
        for (const modelName of modelNames) {
          const model = mongoose.models[modelName];
          collections[modelName] = await model.estimatedDocumentCount();
        }
      } catch (error) {
        console.error('Error counting collections:', error);
      }
    }
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      status: 'ok',
      time: new Date().toISOString(),
      database: {
        status: dbStatus,
        connectTime: dbConnectTime,
        error: dbError,
        collections,
      },
      system: systemInfo,
      performance: {
        responseTime,
      },
      environment: process.env.NODE_ENV,
    });
    
  } catch (error: any) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        status: 'error',
        error: error.message || 'Health check failed',
        time: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
