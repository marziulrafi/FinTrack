import Navbar from "./components/Navbar";
import "./globals.css";
import NextAuthProvider from "./Providers/NextAuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
         <NextAuthProvider>
          
          <Navbar />
          {children}
          
        </NextAuthProvider>
      </body>
    </html>
  );
}