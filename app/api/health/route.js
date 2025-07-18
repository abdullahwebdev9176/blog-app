import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/config/db';

export async function GET() {
  const checks = {
    server: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };

  try {
    // Test database connection
    await connectDB();
    checks.database = 'connected';
  } catch (error) {
    checks.database = 'failed';
    checks.databaseError = error.message;
  }

  // Test environment variables
  checks.envVars = {
    mongoUri: process.env.MONGODB_URI ? 'set' : 'missing',
    jwtSecret: process.env.JWT_SECRET ? 'set' : 'missing',
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'set' : 'missing',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ? 'set' : 'missing',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ? 'set' : 'missing',
    publicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL ? 'set' : 'missing'
  };

  const allHealthy = checks.database === 'connected' && 
                    Object.values(checks.envVars).every(status => status === 'set');

  return NextResponse.json({
    healthy: allHealthy,
    ...checks
  }, { 
    status: allHealthy ? 200 : 500 
  });
}
