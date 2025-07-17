// Modern Email Styles - Clean and Professional Design
export const emailStyles = {
  // Base email container styles
  baseStyles: `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #2d3748;
      max-width: 600px;
      margin: 0 auto;
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    
    .email-wrapper {
      padding: 40px 20px;
    }
    
    .email-container {
      background: #ffffff;
      border-radius: 16px;
      padding: 0;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      position: relative;
    }
    
    .email-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #4f46e5, #06b6d4, #10b981);
    }
  `,

  // Header section styles
  headerStyles: `
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      text-align: center;
      padding: 40px 40px 30px;
      position: relative;
    }
    
    .header::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
    }
    
    .logo {
      font-size: 32px;
      font-weight: 800;
      color: white;
      margin-bottom: 8px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .logo-tagline {
      margin: 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  `,

  // Content section styles
  contentStyles: `
    .content {
      padding: 40px;
    }
    
    .blog-image {
      width: 100%;
      height: 240px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 24px;
      border: 3px solid #f1f5f9;
      transition: transform 0.3s ease;
    }
    
    .blog-title {
      font-size: 28px;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 16px;
      line-height: 1.3;
      letter-spacing: -0.5px;
    }
    
    .blog-meta {
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      color: #64748b;
      font-size: 14px;
      margin-bottom: 24px;
      padding: 16px 20px;
      border-radius: 12px;
      border-left: 4px solid #4f46e5;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
    }
    
    .meta-icon {
      font-size: 16px;
    }
    
    .blog-excerpt {
      font-size: 16px;
      color: #4a5568;
      margin-bottom: 32px;
      line-height: 1.7;
      background: #f8fafc;
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #06b6d4;
      font-style: italic;
    }
  `,

  // Call-to-action button styles
  ctaStyles: `
    .cta-section {
      text-align: center;
      margin: 40px 0;
    }
    
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white !important;
      padding: 18px 36px;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 16px;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
      border: none;
      cursor: pointer;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      position: relative;
      overflow: hidden;
    }
    
    .cta-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: left 0.5s;
    }
    
    .cta-button:hover::before {
      left: 100%;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(79, 70, 229, 0.4);
    }
    
    .cta-icon {
      margin-right: 8px;
      font-size: 18px;
    }
  `,

  // Social links and footer styles
  footerStyles: `
    .social-section {
      background: #f8fafc;
      padding: 30px 40px;
      border-top: 1px solid #e2e8f0;
    }
    
    .social-links {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    
    .social-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: white;
      color: #4f46e5 !important;
      text-decoration: none;
      border-radius: 25px;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    
    .social-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
      border-color: #4f46e5;
    }
    
    .footer {
      background: #1a202c;
      color: #a0aec0;
      padding: 30px 40px;
      text-align: center;
      font-size: 13px;
      line-height: 1.6;
    }
    
    .footer-text {
      margin-bottom: 20px;
      color: #cbd5e0;
    }
    
    .unsubscribe {
      display: inline-block;
      color: #9ca3af !important;
      text-decoration: none;
      margin: 16px 0;
      padding: 8px 16px;
      border: 1px solid #374151;
      border-radius: 6px;
      font-size: 12px;
      transition: all 0.3s ease;
    }
    
    .unsubscribe:hover {
      background: #374151;
      color: #f9fafb !important;
    }
    
    .footer-copyright {
      margin-top: 20px;
      font-size: 11px;
      color: #6b7280;
      border-top: 1px solid #374151;
      padding-top: 16px;
    }
  `,

  // Responsive styles
  responsiveStyles: `
    @media (max-width: 640px) {
      body {
        padding: 0;
      }
      
      .email-wrapper {
        padding: 20px 10px;
      }
      
      .email-container {
        border-radius: 12px;
      }
      
      .header,
      .content,
      .social-section,
      .footer {
        padding-left: 24px;
        padding-right: 24px;
      }
      
      .blog-title {
        font-size: 24px;
      }
      
      .cta-button {
        display: block;
        margin: 20px 0;
        padding: 16px 24px;
        font-size: 15px;
      }
      
      .social-links {
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }
      
      .blog-meta {
        flex-direction: column;
        gap: 8px;
      }
    }
    
    @media (max-width: 480px) {
      .header {
        padding: 30px 20px 24px;
      }
      
      .content {
        padding: 30px 20px;
      }
      
      .logo {
        font-size: 28px;
      }
      
      .blog-title {
        font-size: 22px;
      }
    }
  `
};

// Combine all styles into a single CSS string
export const getEmailCSS = () => {
  return [
    emailStyles.baseStyles,
    emailStyles.headerStyles,
    emailStyles.contentStyles,
    emailStyles.ctaStyles,
    emailStyles.footerStyles,
    emailStyles.responsiveStyles
  ].join('\n');
};
