import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'UIGen — CLI-First UI Generation & Source-Code Platform',
  description:
    'Choose. Generate. Own. Ship. High-performance UI primitives, full page layouts, and customizable Tailwind themes injected straight into your codebase.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-indigo-500 selection:text-white">
        <div className="fixed inset-0 bg-radial-gradient pointer-events-none" />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
