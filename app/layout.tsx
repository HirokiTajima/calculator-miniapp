import type { Metadata } from "next";
import "./globals.css";
import Providers from './providers';
import VerifyGate from '@/components/VerifyGate';

export const metadata: Metadata = {
  title: "Calculator MiniApp",
  description: "World ID protected calculator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <VerifyGate>{children}</VerifyGate>
        </Providers>
      </body>
    </html>
  );
}
