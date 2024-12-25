"use client";

import { useState } from "react";
import Link from "next/link";
import { Book, Code, Settings, Users } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/assets/images/logo.png";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState("getting-started");

  const navigation = [
    {
      title: "Getting Started",
      id: "getting-started",
      icon: Book,
      href: "/docs",
    },
    {
      title: "Developer Guide",
      id: "developer",
      icon: Code,
      href: "/docs/developer",
    },
    {
      title: "Admin Guide",
      id: "admin",
      icon: Settings,
      href: "/docs/admin",
    },
    {
      title: "User Management",
      id: "users",
      icon: Users,
      href: "/docs/users",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="p-6">
          <Link href="/">
            <Image src={Logo} alt="Beblocky logo" height={100} width={150} />
          </Link>
          <p className="text-sm text-muted-foreground mt-1">Documentation</p>
        </div>
        <nav className="px-4 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md mb-1 transition-colors ${
                  activeSection === item.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl py-12 px-6">{children}</div>
      </main>
    </div>
  );
}
