import type { Metadata } from "next";
import { ProfileProvider } from "@/context/ProfileContext";
import "./globals.css";

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
      <body>
        <ProfileProvider>{children}</ProfileProvider>
      </body>
    </html>
  );
}
