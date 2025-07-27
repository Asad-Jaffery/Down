import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Down - Social Events App',
  description: 'A mobile-first social app for creating and joining events',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <script
          src='https://www.google.com/recaptcha/api.js'
          async
          defer
        ></script>
      </head>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
