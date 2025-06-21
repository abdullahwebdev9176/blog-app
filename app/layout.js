import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Header from "../components/Header";
import { Roboto } from "next/font/google";
import { useEffect } from "react";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Blog App",
  description: "My Blog App",
};

export default function RootLayout({ children }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <html lang="en">
      <body className={roboto.variable}>
        <Header />
        {children}
      </body>
    </html>
  );
}
