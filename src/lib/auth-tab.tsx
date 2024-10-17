"use client";

import { Tabs, Tab } from "@nextui-org/react";
import { SignUpForm } from "../components/sign-up-form";
import { SignInForm } from "../components/sign-in-form";

export function AuthTab() {
  return (
    <div className="flex flex-col w-max">
      <Tabs
        aria-label="Options"
        size="lg"
        variant="solid"
        radius="full"
        selectedKey="sign-in"
        classNames={{
          tabList: "bg-brand-green rounded-full w-[480px]",
          tabContent:
            "group-data-[selected=true]:text-[#68b946] text-[#ffffff] font-bold text-xl px-10",
        }}
      >
        <Tab key="sign-in" title="Sign In">
          <SignInForm />
        </Tab>
        <Tab key="register" title="Register">
          <SignUpForm />
        </Tab>
      </Tabs>
    </div>
  );
}
