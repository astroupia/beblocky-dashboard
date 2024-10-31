"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../../public/assets/images/logo.png";
import { Icons } from "./icons";
import SearchBar from "./search-bar";
import { UserButton } from "./user-card";

interface Props {
  items: SidebarNavItem[];
}

export type SidebarNavItem = {
  title: string;
  label?: string;
  href: string;
  icon: keyof typeof Icons;
  disabled?: boolean;
  useInclude?: boolean;
};

export function SideBar({ items }: Props) {
  const path = usePathname();
  const checkActive = (item: SidebarNavItem) => {
    return item.useInclude
      ? path?.includes(item.href ?? "")
      : path === item.href;
  };
  return (
    <div>
      <div className="relative">
        <Image
          src={Logo}
          alt="Beblocky logo"
          className="p-4 px-8 w-30 h-50"
          width={250}
          height={250}
        />
      </div>

      <SearchBar />
      <span className="absolute top-4 right-4 bg-gradient-to-r from-apple-500 to-ecstasy text-white text-xs px-2 py-1 rounded-full animate-pulse">
        BETA
      </span>
      <nav className="grid items-start gap-2 top-24 sticky">
        {items.map((item) => {
          const Icon = Icons[item.icon];
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  " hover:text-accent-foreground transition-all duration-250 group flex items-center px-8 py-2 text-sm font-medium",
                  checkActive(item)
                    ? " border-r-5 border-brand-orange"
                    : " opacity-50 transparent hover:border-r-5 hover:border-brand-orange/60",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-6 w-6" />
                <span className=" text-xl">{item.title}</span>
                {item.label && (
                  <span className=" ml-auto bg-gradient-to-tr from-purple-800 to-stone-800 bg-clip-text text-xs text-transparent dark:from-purple-300 dark:to-stone-200">
                    {item.label}
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </nav>
      <UserButton />
    </div>
  );
}
