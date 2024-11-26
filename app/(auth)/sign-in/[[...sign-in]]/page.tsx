import React from "react";
import { SignIn } from "@clerk/nextjs";

const page = () => {
  return (
    <>
      <section className="h-dvh bg-white m-100 flex justify-center items-center">
        <SignIn />
      </section>
    </>
  );
};

export default page;
