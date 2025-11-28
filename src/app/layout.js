import "./globals.css";
import Header from "../Shared/Header/index";
import Footer from "../Shared/Footer/index";
import ScrollToTop from "../Shared/ScrollToTop";
import Script from "next/script";

export const metadata = {
  title: "TechyBlog - Publish Your Tech Expertise & Build Your Authority | Expert Tech Blogging Platform",
  description: "Transform your technical knowledge into powerful content. Join TechyBlog's elite community of tech writers, publish expert articles, establish thought leadership, and reach millions of readers worldwide. Start writing today and amplify your voice in the tech industry.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MNMP3KLP');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YJW51XQ07Q"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YJW51XQ07Q');
          `}
        </Script>
        <Script id="scroll-to-top" strategy="beforeInteractive">
          {`
            // Ensure page always starts at top
            if (typeof window !== 'undefined') {
              // Scroll to top on page load
              window.addEventListener('load', function() {
                window.scrollTo(0, 0);
              });
              
              // Scroll to top on beforeunload
              window.addEventListener('beforeunload', function() {
                window.scrollTo(0, 0);
              });
              
              // Scroll to top on popstate (back/forward buttons)
              window.addEventListener('popstate', function() {
                setTimeout(function() {
                  window.scrollTo(0, 0);
                }, 100);
              });
              
              // Immediate scroll to top
              window.scrollTo(0, 0);
            }
          `}
        </Script>
      </head>
      <body
        suppressHydrationWarning={true}
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MNMP3KLP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Header />
        <ScrollToTop />
        {children}
        <Footer />
      </body>
    </html>
  );
}
