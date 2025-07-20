// lib/utils/seo.js - SEO metadata utilities

export const siteConfig = {
  name: "MyBlog",
  description: "Discover insightful articles on technology, lifestyle, startups, and more. Join our community of passionate readers and writers.",
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  siteName: "MyBlog",
  author: "MyBlog Team",
  keywords: "blog, technology, lifestyle, startups, articles, insights, community",
  language: "en",
  locale: "en_US",
  type: "website",
  twitterHandle: "@myblog",
};

export function generateMetadata({
  title,
  description,
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags = [],
  canonical,
  noindex = false,
} = {}) {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description || siteConfig.description;
  const metaImage = image || `${siteConfig.url}/og-image.png`;
  const metaUrl = url || siteConfig.url;
  const canonicalUrl = canonical || metaUrl;

  const metadata = {
    title: metaTitle,
    description: metaDescription,
    keywords: [...siteConfig.keywords.split(', '), ...tags].join(', '),
    authors: [{ name: author || siteConfig.author }],
    creator: author || siteConfig.author,
    publisher: siteConfig.name,
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: metaUrl,
      siteName: siteConfig.siteName,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      locale: siteConfig.locale,
      type: type,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
      other: {
        'msvalidate.01': process.env.BING_SITE_VERIFICATION,
      },
    },
  };

  // Add article-specific metadata
  if (type === 'article' && (publishedTime || modifiedTime)) {
    metadata.openGraph.article = {
      publishedTime,
      modifiedTime,
      author: [author || siteConfig.author],
      tags,
    };
  }

  return metadata;
}

export function generateStructuredData({
  type = "WebSite",
  name,
  description,
  url,
  author,
  publishedTime,
  modifiedTime,
  image,
  category,
  tags = [],
  excerpt,
} = {}) {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
    "name": name || siteConfig.name,
    "description": description || siteConfig.description,
    "url": url || siteConfig.url,
  };

  if (type === "WebSite") {
    return {
      ...baseStructuredData,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${siteConfig.url}/blog-posts?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": siteConfig.name,
        "url": siteConfig.url
      }
    };
  }

  if (type === "BlogPosting" || type === "Article") {
    return {
      ...baseStructuredData,
      "@type": "BlogPosting",
      "headline": name,
      "description": excerpt || description,
      "image": image,
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "author": {
        "@type": "Person",
        "name": author || siteConfig.author
      },
      "publisher": {
        "@type": "Organization",
        "name": siteConfig.name,
        "url": siteConfig.url
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      },
      "articleSection": category,
      "keywords": tags.join(", "),
      "wordCount": description ? description.split(' ').length : undefined
    };
  }

  if (type === "Organization") {
    return {
      ...baseStructuredData,
      "@type": "Organization",
      "logo": `${siteConfig.url}/logo.png`,
      "sameAs": [
        // Add your social media URLs here
        "https://twitter.com/myblog",
        "https://facebook.com/myblog",
        "https://linkedin.com/company/myblog"
      ]
    };
  }

  return baseStructuredData;
}

export function getCanonicalUrl(path = '') {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export function extractPlainTextFromHTML(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export function generateExcerpt(content, maxLength = 160) {
  if (!content) return '';
  const plainText = extractPlainTextFromHTML(content);
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
}
