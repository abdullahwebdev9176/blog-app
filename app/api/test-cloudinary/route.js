import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET() {
  try {
    // Check environment variables
    const envVars = {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT_SET',
      NODE_ENV: process.env.NODE_ENV
    };

    // Test Cloudinary configuration
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });

    // Try to get account details (this will verify the credentials)
    try {
      const result = await cloudinary.api.ping();
      
      return NextResponse.json({
        success: true,
        message: 'Cloudinary configuration is working',
        environment: envVars,
        cloudinaryStatus: 'Connected',
        pingResult: result
      });
    } catch (cloudinaryError) {
      return NextResponse.json({
        success: false,
        message: 'Cloudinary configuration failed',
        environment: envVars,
        cloudinaryStatus: 'Failed',
        error: cloudinaryError.message
      }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Configuration check failed',
      error: error.message
    }, { status: 500 });
  }
}
