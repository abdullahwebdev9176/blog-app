# Blog Application with Cloudinary Integration

A full-stack blog application built with Next.js, MongoDB, and Cloudinary for image management.

## 🚀 Features

- **Content Management**: Create, edit, delete blog posts
- **Image Management**: Cloudinary integration for optimized image uploads
- **Categories**: Organize posts by categories
- **Comments System**: User engagement through comments
- **Newsletter**: Email subscription system
- **Admin Dashboard**: Complete admin panel for content management
- **Responsive Design**: Mobile-friendly interface
- **SEO Optimized**: Meta tags and structured data

## 🛠️ Technologies Used

- **Frontend**: Next.js 15, React 19, Bootstrap
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudinary
- **Editor**: Jodit React Editor
- **Styling**: Bootstrap 5, Custom CSS
- **Email**: Nodemailer
- **Authentication**: JWT

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for email notifications)

## ⚙️ Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd blog-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
The `.env.local` file is already configured with:
```env
# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://abdullahwebdev9176:Ma077917600@cluster0.puwen.mongodb.net/blog-app

# JWT Secret
JWT_SECRET=your-jwt-secret-key-make-it-secure

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=abdullah.webdev9176@gmail.com
SMTP_PASS=tgyhhgebxjxwjctb
EMAIL_FROM_NAME=HealthCare
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dzfcfa6mw
CLOUDINARY_API_KEY=223889356249381
CLOUDINARY_API_SECRET=3cm_bYoK8lF9iDQZKrKNqJQBjCc
CLOUDINARY_URL=cloudinary://223889356249381:3cm_bYoK8lF9iDQZKrKNqJQBjCc@dzfcfa6mw

# Next.js Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dzfcfa6mw
```

4. **Set up Cloudinary Upload Preset** (Optional for widget uploads)
- Go to your Cloudinary dashboard
- Navigate to Settings > Upload
- Create an upload preset named "blog-uploads"
- Set it as unsigned for easier frontend uploads

5. **Run the application**
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

6. **Access the application**
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin

## 📁 Project Structure

```
blog-app/
├── app/                    # Next.js app directory
│   ├── (main)/            # Main layout group
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── blogs/             # Blog detail pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
├── lib/                   # Utilities and configurations
│   ├── config/           # Database and Cloudinary config
│   ├── models/           # MongoDB models
│   └── services/         # Email and other services
├── public/               # Static assets
└── Assets/               # Project assets
```

## 🔧 Key Features Implemented

### Cloudinary Integration
- **Automatic image optimization**: Images are automatically resized and compressed
- **Multiple upload methods**: Form uploads and Jodit editor integration
- **Organized storage**: Images stored in specific folders (blog-images, blog-editor-uploads)
- **CDN delivery**: Fast image loading via Cloudinary CDN

### Admin Features
- **Blog Management**: Create, edit, delete blog posts
- **Category Management**: Organize content with categories
- **Comment Moderation**: Approve/reject comments
- **Newsletter Management**: Send newsletters to subscribers
- **Dashboard Analytics**: View site statistics

### Database Models
- **Blog**: Title, content, author, category, views, likes
- **Category**: Name, description
- **Comment**: User comments with moderation
- **Subscriber**: Newsletter subscription management

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

### Environment Variables for Production
Make sure to set all environment variables in your deployment platform.

## 📝 API Endpoints

### Blog APIs
- `GET /api/blog` - Get all blogs
- `POST /api/blog` - Create new blog
- `PUT /api/blog?id=<id>` - Update blog
- `DELETE /api/blog?id=<id>` - Delete blog

### Upload APIs
- `POST /api/uploads` - Direct file upload (deprecated, use Cloudinary)
- `POST /api/cloudinary-upload` - Cloudinary upload
- `POST /api/jodit-upload` - Jodit editor uploads

### Admin APIs
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/subscribers` - Newsletter subscribers
- `POST /api/admin/newsletter` - Send newsletter

## 🔒 Security Features

- JWT authentication for admin access
- Input validation and sanitization
- File type and size restrictions
- CORS configuration
- Environment variable protection

## 📧 Email Configuration

The application uses Gmail SMTP for:
- Newsletter notifications
- New post announcements
- Admin notifications

## 🎨 Customization

### Styling
- Bootstrap 5 for responsive design
- Custom CSS in `components/` directories
- FontAwesome icons integration

### Content Editor
- Jodit React Editor with Cloudinary integration
- Image upload directly in editor
- Rich text formatting options

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB Atlas is accessible
   - Check connection string in `.env.local`
   - Verify IP whitelist in MongoDB Atlas

2. **Cloudinary Upload Fails**
   - Verify API credentials
   - Check upload preset configuration
   - Ensure file size limits

3. **Build Errors**
   - Clear `.next` folder and rebuild
   - Check for syntax errors in code
   - Verify all dependencies are installed

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review console logs for specific errors
3. Verify environment variables are set correctly

## 🔄 Recent Updates

- ✅ Cloudinary integration complete
- ✅ MongoDB Atlas connection configured
- ✅ Image optimization and CDN delivery
- ✅ Jodit editor with cloud uploads
- ✅ Production-ready build system

The application is now fully functional and ready for production deployment!
