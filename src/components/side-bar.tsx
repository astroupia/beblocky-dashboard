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
      <Image
        src={Logo}
        alt="Beblocky logo"
        className="px-2"
        width={180}
        height={180}
      />
      <SearchBar />
      <nav className="grid items-start gap-2 top-24 sticky">
        {items.map((item) => {
          const Icon = Icons[item.icon];
          return (
            <Link href={item.href}>
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
