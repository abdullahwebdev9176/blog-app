# Production Deployment Checklist

## Environment Variables (CRITICAL)

Ensure these environment variables are set in your production environment:

### Required Variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secure JWT secret key
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Public Cloudinary cloud name
- `NEXT_PUBLIC_SITE_URL` - Your production domain URL

### Optional (for email features):
- `SMTP_HOST` - Email server host
- `SMTP_PORT` - Email server port
- `SMTP_USER` - Email username
- `SMTP_PASS` - Email password
- `EMAIL_FROM_NAME` - Sender name for emails

## Testing Cloudinary Configuration

1. Deploy your app
2. Visit: `https://your-domain.com/api/test-cloudinary`
3. Check if response shows "Connected" status

## Common Production Issues:

### 1. Missing Environment Variables
**Error**: "Missing required Cloudinary environment variables"
**Solution**: Ensure all Cloudinary env vars are set in production

### 2. Wrong Environment Variable Names
**Error**: "Failed to upload image to Cloudinary"
**Solution**: Double-check variable names match exactly:
- `CLOUDINARY_CLOUD_NAME` (not CLOUD_NAME)
- `CLOUDINARY_API_KEY` (not API_KEY)
- `CLOUDINARY_API_SECRET` (not API_SECRET)

### 3. Environment Variables Not Loading
**Error**: Configuration shows undefined values
**Solutions**:
- For Vercel: Add in Dashboard → Settings → Environment Variables
- For Netlify: Add in Site Settings → Environment Variables
- For Railway: Add in Variables tab
- For Docker: Use --env-file flag

### 4. Network/Firewall Issues
**Error**: "Cloudinary upload failed: Network error"
**Solution**: Ensure your hosting platform allows outbound HTTPS requests

### 5. File Size Issues
**Error**: "Upload failed"
**Solution**: Check if file exceeds Cloudinary limits (10MB default)

## Platform-Specific Instructions:

### Vercel:
1. Go to Project Dashboard
2. Settings → Environment Variables
3. Add all required variables
4. Redeploy

### Netlify:
1. Site Dashboard → Site Settings
2. Environment Variables
3. Add variables
4. Redeploy

### Railway:
1. Project Dashboard
2. Variables tab
3. Add variables
4. Redeploy

## Testing Steps:

1. **Test Cloudinary**: `/api/test-cloudinary`
2. **Test Upload**: Try creating a blog post with image
3. **Test Database**: Check if blog appears in admin panel
4. **Test Email**: Create blog and verify newsletter sending

## Debug Mode:

If issues persist, check browser console and server logs for detailed error messages.

The app now includes comprehensive error logging to help identify issues.
