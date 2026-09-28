import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cute To-do List",
  description: "A cute, simple, and minimal to-do list app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col relative overflow-x-hidden`}>
        {/* Background decorative elements */}
        <div className="fixed top-[-10%] left-[-10%] w-64 h-64 bg-pastel-pink rounded-full opacity-20 blur-3xl -z-10"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-80 h-80 bg-pastel-blue rounded-full opacity-20 blur-3xl -z-10"></div>
        
        <main className="flex-1 flex flex-col">
          <AuthProvider>
            {children}
          </AuthProvider>
        </main>
      </body>
    </html>
  );
}
