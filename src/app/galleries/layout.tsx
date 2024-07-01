import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserProvider } from '@auth0/nextjs-auth0/client';
const inter = Inter({ subsets: ["latin"] });

export default function Layout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <UserProvider>
      <body className={inter.className}>{children}</body>
    </UserProvider>
    </html>
  );
}
