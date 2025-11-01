import Navbar from "./components/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <div className="max-w-[1400px] mx-auto px-4">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}