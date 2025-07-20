import nodemailer from 'nodemailer';
import { getEmailCSS } from './emailStyles.js';

// Email configuration
const createTransporter = () => {
  // Clean up the password by removing any spaces
  const cleanPassword = (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').replace(/\s+/g, '');
  
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: cleanPassword,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Email templates
export const emailTemplates = {
  newBlogPost: (blogPost, unsubscribeLink) => ({
    subject: `📝 New Blog Post: ${blogPost.title}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Blog Post</title>
        <style>
          ${getEmailCSS()}
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <div class="header">
              <div class="logo">📝 ${process.env.EMAIL_FROM_NAME || 'HealthCare Blog'}</div>
              <p class="logo-tagline">Fresh insights delivered to your inbox</p>
            </div>

            <div class="content">
              ${blogPost.image ? `<img src="${process.env.NEXT_PUBLIC_SITE_URL}${blogPost.image}" alt="${blogPost.title}" class="blog-image" />` : ''}
              
              <h1 class="blog-title">${blogPost.title}</h1>
              
              <div class="blog-meta">
                <div class="meta-item">
                  <span class="meta-icon">📅</span>
                  <strong>Published:</strong> ${new Date(blogPost.date || blogPost.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div class="meta-item">
                  <span class="meta-icon">✍️</span>
                  <strong>Author:</strong> ${blogPost.author}
                </div>
                <div class="meta-item">
                  <span class="meta-icon">🏷️</span>
                  <strong>Category:</strong> ${blogPost.category}
                </div>
              </div>

              <div class="blog-excerpt">
                ${blogPost.description ? blogPost.description.replace(/<[^>]*>/g, '').substring(0, 300) + '...' : 'Click below to read the full article and discover more insights.'}
              </div>

              <div class="cta-section">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${blogPost.slug || blogPost._id}" class="cta-button">
                  <span class="cta-icon">📖</span>
                  Read Full Article
                </a>
              </div>
            </div>

            <div class="social-section">
              <div class="social-links">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="social-link">
                  🏠 Visit Website
                </a>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/blog-posts" class="social-link">
                  📰 All Posts
                </a>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/contact" class="social-link">
                  ✉️ Contact Us
                </a>
              </div>
            </div>
            
            <div class="footer">
              <p class="footer-text">
                You're receiving this email because you subscribed to our newsletter.<br>
                We respect your privacy and will never share your email address.
              </p>
              
              <a href="${unsubscribeLink}" class="unsubscribe">
                🚫 Unsubscribe from future emails
              </a>
              
              <div class="footer-copyright">
                © ${new Date().getFullYear()} ${process.env.EMAIL_FROM_NAME || 'HealthCare Blog'}. All rights reserved.<br>
                This email was sent automatically when a new blog post was published.
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      New Blog Post: ${blogPost.title}
      
      Author: ${blogPost.author}
      Category: ${blogPost.category}
      Published: ${new Date(blogPost.date || blogPost.createdAt).toLocaleDateString()}
      
      ${blogPost.description ? blogPost.description.replace(/<[^>]*>/g, '').substring(0, 300) + '...' : ''}
      
      Read the full article: ${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${blogPost.slug || blogPost._id}
      
      ---
      You're receiving this email because you subscribed to our newsletter.
      Unsubscribe: ${unsubscribeLink}
    `
  }),

  welcome: (email) => ({
    subject: '🎉 Welcome to Our Newsletter!',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our Newsletter</title>
        <style>
          ${getEmailCSS()}
          .welcome-content {
            text-align: center;
            padding: 40px;
          }
          .welcome-icon {
            font-size: 80px;
            margin-bottom: 24px;
            display: block;
          }
          .welcome-title {
            font-size: 32px;
            font-weight: 800;
            color: #1a202c;
            margin-bottom: 16px;
            letter-spacing: -0.5px;
          }
          .welcome-message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 32px;
            line-height: 1.7;
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
          }
          .features-list {
            text-align: left;
            display: inline-block;
            background: #f8fafc;
            padding: 24px 32px;
            border-radius: 12px;
            border-left: 4px solid #4f46e5;
            margin: 24px 0;
          }
          .features-list li {
            margin-bottom: 12px;
            font-weight: 500;
            color: #2d3748;
          }
          .cta-buttons {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 32px;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <div class="header">
              <div class="logo">🎉 ${process.env.EMAIL_FROM_NAME || 'HealthCare Blog'}</div>
              <p class="logo-tagline">Welcome to our community!</p>
            </div>

            <div class="welcome-content">
              <span class="welcome-icon">🎉</span>
              <h1 class="welcome-title">Welcome to Our Newsletter!</h1>
              
              <div class="welcome-message">
                <p><strong>Hi there! 👋</strong></p>
                <p>Thank you for subscribing to our newsletter. We're excited to have you as part of our community!</p>
                
                <div class="features-list">
                  <p><strong>You'll receive notifications about:</strong></p>
                  <ul>
                    <li>📝 New blog posts and articles</li>
                    <li>🔥 Trending content and updates</li>
                    <li>💡 Exclusive tips and insights</li>
                    <li>🎁 Special offers and announcements</li>
                  </ul>
                </div>
              </div>

              <div class="cta-buttons">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/blog-posts" class="cta-button">
                  <span class="cta-icon">📚</span>
                  Browse Latest Posts
                </a>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="cta-button" style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); box-shadow: 0 8px 20px rgba(6, 182, 212, 0.3);">
                  <span class="cta-icon">🏠</span>
                  Visit Website
                </a>
              </div>
            </div>

            <div class="footer">
              <p class="footer-text">
                We respect your privacy and will never share your email address.<br>
                You can unsubscribe at any time from future emails.
              </p>
              <div class="footer-copyright">
                © ${new Date().getFullYear()} ${process.env.EMAIL_FROM_NAME || 'HealthCare Blog'}. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Our Newsletter!
      
      Thank you for subscribing! You'll receive notifications about new blog posts, trending content, and exclusive updates.
      
      Browse our latest posts: ${process.env.NEXT_PUBLIC_SITE_URL}/blog-posts
      Visit our website: ${process.env.NEXT_PUBLIC_SITE_URL}
    `
  })
};

// Send email to single recipient
export const sendEmail = async (to, template) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'My Blog'}" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    return { success: false, error: error.message };
  }
};

// Send bulk emails with rate limiting
export const sendBulkEmails = async (recipients, template, options = {}) => {
  const { batchSize = 10, delayBetweenBatches = 1000 } = options;
  const results = [];
  
  try {
    console.log(`Starting bulk email send to ${recipients.length} recipients`);
    
    // Process in batches to avoid overwhelming the SMTP server
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(recipients.length / batchSize)}`);
      
      // Send emails in current batch concurrently
      const batchPromises = batch.map(async (recipient) => {
        const recipientEmail = typeof recipient === 'string' ? recipient : recipient.email;
        
        // Create unsubscribe link for this specific recipient
        const unsubscribeToken = Buffer.from(JSON.stringify({ 
          email: recipientEmail, 
          timestamp: Date.now() 
        })).toString('base64');
        
        const unsubscribeLink = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${unsubscribeToken}`;
        
        // Customize template for this recipient
        const customizedTemplate = {
          ...template,
          html: template.html.replace(/\{unsubscribeLink\}/g, unsubscribeLink),
          text: template.text.replace(/\{unsubscribeLink\}/g, unsubscribeLink)
        };
        
        return sendEmail(recipientEmail, customizedTemplate);
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add delay between batches (except for the last batch)
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    console.log(`Bulk email send completed: ${successCount} successful, ${failureCount} failed`);
    
    return {
      success: true,
      totalSent: successCount,
      totalFailed: failureCount,
      results
    };
  } catch (error) {
    console.error('Error in bulk email send:', error);
    return {
      success: false,
      error: error.message,
      results
    };
  }
};

// Send newsletter notification for new blog post
export const sendNewPostNotification = async (blogPost) => {
  try {
    const { SubscriberModel } = await import('@/lib/models/SubscriberModel');
    
    // Get all active subscribers
    const activeSubscribers = await SubscriberModel.findActiveSubscribers();
    
    if (activeSubscribers.length === 0) {
      console.log('No active subscribers to notify');
      return { success: true, message: 'No active subscribers to notify' };
    }
    
    console.log(`Sending new post notification to ${activeSubscribers.length} subscribers`);
    
    // Create email template
    const template = emailTemplates.newBlogPost(blogPost, '{unsubscribeLink}');
    
    // Send bulk emails
    const result = await sendBulkEmails(activeSubscribers, template, {
      batchSize: 5, // Smaller batches for blog notifications
      delayBetweenBatches: 2000 // 2 second delay between batches
    });
    
    return result;
  } catch (error) {
    console.error('Error sending new post notification:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email to new subscriber
export const sendWelcomeEmail = async (email) => {
  try {
    const template = emailTemplates.welcome(email);
    return await sendEmail(email, template);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};
