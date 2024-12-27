import { getDashboardData } from "@/actions/parents";
import { MobileNav } from "@/components/mobile-nav";
import { SideBar, SidebarNavItem } from "@/components/side-bar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const items: SidebarNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "Home",
  },
  {
    title: "Progress",
    href: "/dashboard/progress",
    icon: "Progress",
    useInclude: true,
  },
  {
    title: "Courses",
    href: "/dashboard/courses",
    icon: "Courses",
  },
  {
    title: "Upgrade Plan",
    href: "/dashboard/upgrade",
    icon: "Cart",
  },
  // {
  //   title: "Support",
  //   href: "/dashboard/support",
  //   icon: "Support",
  // },
  {
    title: "Setting",
    href: "/dashboard/settings",
    icon: "Settings",
  },
];

export default async function layout({ children }: Props) {
  const data = await getDashboardData();
  return (
    <main className="grid md:grid-cols-6 min-h-screen ">
      <aside className="hidden h-screen flex-col md:flex md:sticky md:top-0">
        {data && <SideBar items={items} role={data.role} />}
      </aside>
      <main className="col-span-5 bg-white border-l rounded-l-3xl md:p-8 md:px-16 p-4">
        <MobileNav items={items} />
        {children}
      </main>
    </main>
  );
}
