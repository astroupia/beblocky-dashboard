import { ClerkProvider, SignedOut, SignedIn } from "@clerk/nextjs";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beblocky Admin Dashboard",
  description: "Analytics Oriented",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body>{children}</body>
      </ClerkProvider>
    </html>
  );
}
