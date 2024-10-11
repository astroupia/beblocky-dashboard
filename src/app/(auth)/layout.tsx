"use client";
import { tabStyle } from "@/lib/style";
import { Tab, Tabs } from "@nextui-org/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import Banner from "../../../public/assets/images/iStock-1278915635.jpg";
import Logo from "../../../public/assets/images/logo.png";
interface Props {
  children: ReactNode;
}
export default function authLayout({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="grid lg:grid-cols-2 gap-4 lg:gap-x-12 lg:mb-0 w-full h-full">
      <div>
        <Image src={Logo} alt="Beblocky logo" className="p-4 h-28 w-52" />
        <div className="flex flex-col justify-center items-center mt-10 mb-6">
          <h2 className="lg:text-7xl text-2xl font-bold font-heading tracking-tight mb-4 text-ecstasy">
            Hi, there!
          </h2>
          <p className=" mb-6 text-dark-ebony font-medium">
            Welcome to BeBlocky Dashboard
          </p>
        </div>
        <div className=" flex items-center justify-center">
          <div className="flex flex-col w-full px-4 md:px-24 2xl:px-36">
            <Tabs
              aria-label="Options"
              size="lg"
              selectedKey={pathname}
              variant="solid"
              radius="full"
              classNames={tabStyle}
              onSelectionChange={(key) => {
                router.push(key.toString());
              }}
            >
              <Tab key="/sign-in" title="Sign In">
                {pathname === "/sign-in" && children}
              </Tab>
              <Tab key="/sign-up" title="Register">
                {pathname === "/sign-up" && children}
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      <div className="justify-end hidden md:flex">
        <div className="w-10/12 flex justify-center">
          <Image
            src={Banner}
            alt=""
            className=" hidden md:block self-center lg:block object-cover bg-center w-auto h-screen"
            style={{
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      </div>
    </div>
  );
}
