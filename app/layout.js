import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { Roboto } from "next/font/google";
import Script from "next/script";
import LayoutClientShell from "@/components/LayoutClientShell";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
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
