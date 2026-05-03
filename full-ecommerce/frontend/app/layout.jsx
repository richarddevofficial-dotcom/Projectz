import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FashionStore - Premium Clothing Store',
  description: 'Shop the latest fashion trends for men, women, and kids. Free shipping on orders over $50.',
  keywords: 'fashion, clothing, online store, ecommerce',
  authors: [{ name: 'FashionStore' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'FashionStore - Premium Clothing Store',
    description: 'Shop the latest fashion trends',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}