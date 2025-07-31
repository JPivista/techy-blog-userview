import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../Shared/Header/index";
import Footer from "../Shared/Footer/index";
import ScrollToTop from "../Shared/ScrollToTop";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TechyBlog - Share Your Knowledge with the World",
  description: "Join our community of passionate writers and start sharing your knowledge with the world. Write blogs, build authority, and connect with readers worldwide.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
      // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <ScrollToTop />
        {children}
        <Footer />
      </body>
    </html>
  );
}
