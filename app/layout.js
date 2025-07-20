import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { Roboto } from "next/font/google";
import Script from "next/script";
import LayoutClientShell from "@/components/LayoutClientShell";
import { generateMetadata as generateSEOMetadata, generateStructuredData, siteConfig } from "@/lib/utils/seo";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
});

export const metadata = generateSEOMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  type: "website",
});

export default function RootLayout({ children }) {
  const websiteStructuredData = generateStructuredData({
    type: "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  });

  const organizationStructuredData = generateStructuredData({
    type: "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
      </head>
      <body className={roboto.variable}>
        <LayoutClientShell>
          <main style={{ minHeight: "75vh" }}>
            {children}
          </main>
        </LayoutClientShell>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
