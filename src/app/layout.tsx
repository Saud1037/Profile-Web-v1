import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ProfileProvider } from "@/context/ProfileContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Profile",
  description: "Personal profile page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <ProfileProvider>{children}</ProfileProvider>
      </body>
    </html>
  );
}
