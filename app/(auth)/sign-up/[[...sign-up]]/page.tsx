import { SignUp } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return (
    <>
      <section className="h-dvh bg-white m-100 flex justify-center items-center">
        <SignUp />
      </section>
    </>
  );
};

export default page;
