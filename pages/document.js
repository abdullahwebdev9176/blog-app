// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ✅ Bootstrap CSS CDN */}
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-q2VyM6+lpLM6L74wE68jxXWOT0aDeUMj3LjAw4KHEyf7s3phf+GJQklbBP4kLk+x"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        
        {/* ✅ Bootstrap JS CDN (optional, for dropdowns/modals) */}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-C5Ytcywv6zzdnU8qRhGbi6uVTIQ7Ekk4AJvjR+AeGbGWG00fT+IMLDGyRhs5lZl+"
          crossOrigin="anonymous"
        ></script>
      </body>
    </Html>
  )
}
