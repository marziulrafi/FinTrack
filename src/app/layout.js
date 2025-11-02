import Navbar from "./components/Navbar";
import "./globals.css";
import NextAuthProvider from "./Providers/NextAuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <div className="max-w-[1400px] mx-auto px-4">
          <NextAuthProvider>
            <Navbar />
            {children}
          </NextAuthProvider>
        </div>
      </body>
    </html>
  );
}