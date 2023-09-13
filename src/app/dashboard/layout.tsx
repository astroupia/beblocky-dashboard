import { MobileNav } from "@/components/mobile-nav";
import { SideBar } from "@/components/side-bar";
import { ReactNode } from "react";


interface Props {
    children: ReactNode
}


export default function layout({ children }: Props) {
    return (
        <main className="grid md:grid-cols-5 min-h-screen bg-brand-light-green">
            <aside className="hidden h-screen  flex-col md:flex md:sticky md:top-0">
                <SideBar items={[{
                    title: "Dashboard",
                    href: "/dashboard",
                    icon: "Home"
                }, {
                    title: "Progress",
                    href: "/progress",
                    icon: "Progress"
                }, {
                    title: "Courses",
                    href: "/dashboard/courses",
                    icon: "Courses"
                }, {
                    title: "Upgrade Plan",
                    href: "/upgrade",
                    icon: "Cart"
                }, {
                    title: "Support",
                    href: "/support",
                    icon: "Support"
                }, {
                    title: "Setting",
                    href: "/settings",
                    icon: "Settings"
                }]} />
            </aside>
            <main className=" col-span-4 bg-white rounded-l-3xl md:p-8 md:px-16 p-4">
                <MobileNav />
                {children}
            </main>
        </main>
    )
}