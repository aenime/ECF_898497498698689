import type { Metadata } from "next";
import { ToastProvider } from "@/components/providers/toast-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlipKart - Online Shopping Store",
  description: "Your one-stop destination for all your shopping needs. Quality products at affordable prices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans antialiased">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
