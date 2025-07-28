import { ModernNavbar } from "@/components/layout/modern-navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ModernNavbar />
      <main className="pt-20">{children}</main>
    </>
  );
}
