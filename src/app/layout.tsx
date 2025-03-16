import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Pole Dance Instructor",
  description: "Learn pole dancing with real-time AI feedback and guidance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
          <nav className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <h1 className="text-white text-xl font-bold">AI Pole Dance Instructor</h1>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      <a href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
                      <a href="/practice" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Practice</a>
                      <a href="/moves" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Moves</a>
                      <a href="/progress" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Progress</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
